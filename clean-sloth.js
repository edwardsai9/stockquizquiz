const sharp = require('sharp');
const fs = require('fs');

async function cleanSloth() {
  try {
    const image = sharp('res_passive_raw.png');
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const rgba = new Uint8ClampedArray(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      rgba[i * 4] = data[i * 3];
      rgba[i * 4 + 1] = data[i * 3 + 1];
      rgba[i * 4 + 2] = data[i * 3 + 2];
      rgba[i * 4 + 3] = 255;
    }

    const visited = new Uint8Array(width * height);
    const queue = [];

    // Background classification including green key-out
    function isBackground(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const chroma = max - min;

      // 1. Dark pixels (shadows)
      if (max < 45) return true;

      // 2. Grayscale neutral pixels (gray background)
      if (chroma < 20) return true;

      // 3. Green pixels (green foliage background: G is larger than R and B)
      if (g > r && g > b) return true;

      return false;
    }

    // Border seeds
    for (let x = 0; x < width; x++) {
      let idxTop = (0 * width + x) * 4;
      if (isBackground(rgba[idxTop], rgba[idxTop+1], rgba[idxTop+2])) {
        queue.push([x, 0]);
        visited[0 * width + x] = 1;
      }
      let idxBot = ((height - 1) * width + x) * 4;
      if (isBackground(rgba[idxBot], rgba[idxBot+1], rgba[idxBot+2])) {
        queue.push([x, height - 1]);
        visited[(height - 1) * width + x] = 1;
      }
    }
    for (let y = 1; y < height - 1; y++) {
      let idxLeft = (y * width + 0) * 4;
      if (isBackground(rgba[idxLeft], rgba[idxLeft+1], rgba[idxLeft+2])) {
        queue.push([0, y]);
        visited[y * width + 0] = 1;
      }
      let idxRight = (y * width + (width - 1)) * 4;
      if (isBackground(rgba[idxRight], rgba[idxRight+1], rgba[idxRight+2])) {
        queue.push([width - 1, y]);
        visited[y * width + (width - 1)] = 1;
      }
    }

    let head = 0;
    let transparentCount = 0;

    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      const idx = (cy * width + cx) * 4;
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
            if (isBackground(rgba[nPixelIdx], rgba[nPixelIdx+1], rgba[nPixelIdx+2])) {
              visited[nidx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Soft edges
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (rgba[idx + 3] > 0) {
          const t1 = rgba[((y - 1) * width + x) * 4 + 3] === 0;
          const t2 = rgba[((y + 1) * width + x) * 4 + 3] === 0;
          const t3 = rgba[(y * width + (x - 1)) * 4 + 3] === 0;
          const t4 = rgba[(y * width + (x + 1)) * 4 + 3] === 0;

          if (t1 || t2 || t3 || t4) {
            rgba[idx + 3] = Math.round(rgba[idx + 3] * 0.4);
          }
        }
      }
    }

    await sharp(Buffer.from(rgba), {
      raw: { width, height, channels: 4 }
    })
    .png()
    .toFile('res_passive.png');

    console.log(`Cleaned sloth: saved res_passive.png. Transparent pixels: ${transparentCount} (${((transparentCount / (width * height)) * 100).toFixed(1)}%)`);
  } catch (err) {
    console.error(err);
  }
}

cleanSloth();
