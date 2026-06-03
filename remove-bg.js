const sharp = require('sharp');
const path = require('path');

async function removeBackground(inputPath, outputPath, threshold = 65) {
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

    // If input is RGB, convert to RGBA
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

    // Sample background color at (0,0)
    const bgR = rgba[0];
    const bgG = rgba[1];
    const bgB = rgba[2];

    const visited = new Uint8Array(width * height);
    const queue = [];

    // Initialize boundary
    for (let x = 0; x < width; x++) {
      queue.push([x, 0]);
      queue.push([x, height - 1]);
      visited[0 * width + x] = 1;
      visited[(height - 1) * width + x] = 1;
    }
    for (let y = 1; y < height - 1; y++) {
      queue.push([0, y]);
      queue.push([width - 1, y]);
      visited[y * width + 0] = 1;
      visited[y * width + (width - 1)] = 1;
    }

    let head = 0;
    let transparentCount = 0;

    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      const idx = (cy * width + cx) * 4;
      const r = rgba[idx];
      const g = rgba[idx+1];
      const b = rgba[idx+2];
      const a = rgba[idx+3];

      const dist = Math.sqrt(
        Math.pow(r - bgR, 2) +
        Math.pow(g - bgG, 2) +
        Math.pow(b - bgB, 2)
      );

      if (dist < threshold || a === 0) {
        rgba[idx + 3] = 0; // Set Alpha to 0
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
              visited[nidx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Edge softening
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (rgba[idx + 3] > 0) {
          const hasTransparentNeighbor =
            rgba[((y - 1) * width + x) * 4 + 3] === 0 ||
            rgba[((y + 1) * width + x) * 4 + 3] === 0 ||
            rgba[(y * width + (x - 1)) * 4 + 3] === 0 ||
            rgba[(y * width + (x + 1)) * 4 + 3] === 0;

          if (hasTransparentNeighbor) {
            rgba[idx + 3] = Math.round(rgba[idx + 3] * 0.5);
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

    console.log(`Successfully saved transparent image to ${outputPath}. Made ${transparentCount} pixels transparent.`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Usage: node remove-bg.js <inputPath> <outputPath> [threshold]");
    process.exit(1);
  }
  const input = args[0];
  const output = args[1];
  const thresh = args[2] ? parseInt(args[2], 10) : 65;
  removeBackground(input, output, thresh);
}
