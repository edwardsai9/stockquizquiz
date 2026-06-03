const sharp = require('sharp');
const fs = require('fs');

async function removeBackgroundSmart(inputPath, outputPath, maxChroma = 25, maxDark = 60) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Get raw pixel buffer
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const dataLength = width * height * 4;
    const rgba = new Uint8ClampedArray(dataLength);

    // Convert to RGBA
    if (info.channels === 3) {
      for (let i = 0; i < width * height; i++) {
        rgba[i * 4] = data[i * 3];
        rgba[i * 4 + 1] = data[i * 3 + 1];
        rgba[i * 4 + 2] = data[i * 3 + 2];
        rgba[i * 4 + 3] = 255;
      }
    } else {
      rgba.set(data);
    }

    const visited = new Uint8Array(width * height);
    const queue = [];

    // Check if a pixel is neutral or dark background
    function isBackgroundPixel(r, g, b) {
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const chroma = maxVal - minVal;

      // 1. If it's very dark, it's background shadow
      if (maxVal < maxDark) return true;

      // 2. If it has low saturation (neutral gray/white), it's background
      if (chroma < maxChroma) return true;

      return false;
    }

    // Initialize seeds from all four boundaries
    for (let x = 0; x < width; x++) {
      // Top boundary
      let idxTop = (0 * width + x) * 4;
      if (isBackgroundPixel(rgba[idxTop], rgba[idxTop+1], rgba[idxTop+2])) {
        queue.push([x, 0]);
        visited[0 * width + x] = 1;
      }
      // Bottom boundary
      let idxBot = ((height - 1) * width + x) * 4;
      if (isBackgroundPixel(rgba[idxBot], rgba[idxBot+1], rgba[idxBot+2])) {
        queue.push([x, height - 1]);
        visited[(height - 1) * width + x] = 1;
      }
    }
    for (let y = 1; y < height - 1; y++) {
      // Left boundary
      let idxLeft = (y * width + 0) * 4;
      if (isBackgroundPixel(rgba[idxLeft], rgba[idxLeft+1], rgba[idxLeft+2])) {
        queue.push([0, y]);
        visited[y * width + 0] = 1;
      }
      // Right boundary
      let idxRight = (y * width + (width - 1)) * 4;
      if (isBackgroundPixel(rgba[idxRight], rgba[idxRight+1], rgba[idxRight+2])) {
        queue.push([width - 1, y]);
        visited[y * width + (width - 1)] = 1;
      }
    }

    let head = 0;
    let transparentCount = 0;

    // Flood fill BFS
    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      const idx = (cy * width + cx) * 4;
      
      // Make this pixel transparent
      rgba[idx + 3] = 0;
      transparentCount++;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          if (!visited[nidx]) {
            const nPixelIdx = nidx * 4;
            const nr = rgba[nPixelIdx];
            const ng = rgba[nPixelIdx+1];
            const nb = rgba[nPixelIdx+2];

            if (isBackgroundPixel(nr, ng, nb)) {
              visited[nidx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Edge softening (anti-aliasing)
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (rgba[idx + 3] > 0) {
          const t1 = rgba[((y - 1) * width + x) * 4 + 3] === 0;
          const t2 = rgba[((y + 1) * width + x) * 4 + 3] === 0;
          const t3 = rgba[(y * width + (x - 1)) * 4 + 3] === 0;
          const t4 = rgba[(y * width + (x + 1)) * 4 + 3] === 0;

          if (t1 || t2 || t3 || t4) {
            // Apply semi-transparency for edge softening
            rgba[idx + 3] = Math.round(rgba[idx + 3] * 0.4);
          }
        }
      }
    }

    // Write RGBA buffer back to PNG file
    await sharp(Buffer.from(rgba), {
      raw: {
        width,
        height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log(`[Smart BG] Saved ${outputPath}. Total transparent pixels: ${transparentCount} (${((transparentCount / (width * height)) * 100).toFixed(1)}%)`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Usage: node remove-bg-smart.js <inputPath> <outputPath> [maxChroma] [maxDark]");
    process.exit(1);
  }
  const input = args[0];
  const output = args[1];
  const chroma = args[2] ? parseInt(args[2], 10) : 25;
  const dark = args[3] ? parseInt(args[3], 10) : 60;
  removeBackgroundSmart(input, output, chroma, dark);
}
