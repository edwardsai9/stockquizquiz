const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

const API_KEY = '0000000000';
const CLIENT_AGENT = 'stock-strategy-quiz:1.0.0:developer@gmail.com';

const item = {
  name: 'dividend',
  prompt: "A luxury 3D golden metallic alpaca statue, smiling, carrying small chest of gold coins and emeralds, glowing emerald green eyes, hyper-detailed, masterpiece, professional 3D CGI render, isolated on a solid green screen background. ### shadow, floor, gradient, table, pedestal, ground"
};

function submitJob() {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      prompt: item.prompt,
      models: ["AlbedoBase XL (SDXL)", "AlbedoBase XL 3.1", "Dreamshaper", "AbsoluteReality", "Deliberate"],
      params: {
        n: 1,
        width: 512,
        height: 512,
        steps: 25,
        sampler_name: "k_euler",
        cfg_scale: 7.5
      }
    });

    const options = {
      hostname: 'stablehorde.net',
      path: '/api/v2/generate/async',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY,
        'Client-Agent': CLIENT_AGENT
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 202) {
          try {
            const data = JSON.parse(body);
            resolve(data.id);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${body}`));
          }
        } else {
          reject(new Error(`Server returned status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

function checkStatus(jobId) {
  return new Promise((resolve, reject) => {
    https.get(`https://stablehorde.net/api/v2/generate/status/${jobId}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (e) {
          reject(new Error(`Failed to parse status response: ${body}`));
        }
      });
    }).on('error', (e) => reject(e));
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (e) => {
      fs.unlink(dest, () => {});
      reject(e);
    });
  });
}

async function removeBackgroundGreenOnly(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
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

    // STRICT GREEN SCREEN DETECTION: only key out bright green, do not touch dark borders/crevices
    function isGreenScreen(r, g, b) {
      return (g > 65 && g > r * 1.15 && g > b * 1.15);
    }

    // Seed from borders
    for (let x = 0; x < width; x++) {
      let idxTop = (0 * width + x) * 4;
      if (isGreenScreen(rgba[idxTop], rgba[idxTop+1], rgba[idxTop+2])) {
        queue.push([x, 0]);
        visited[0 * width + x] = 1;
      }
      let idxBot = ((height - 1) * width + x) * 4;
      if (isGreenScreen(rgba[idxBot], rgba[idxBot+1], rgba[idxBot+2])) {
        queue.push([x, height - 1]);
        visited[(height - 1) * width + x] = 1;
      }
    }
    for (let y = 1; y < height - 1; y++) {
      let idxLeft = (y * width + 0) * 4;
      if (isGreenScreen(rgba[idxLeft], rgba[idxLeft+1], rgba[idxLeft+2])) {
        queue.push([0, y]);
        visited[y * width + 0] = 1;
      }
      let idxRight = (y * width + (width - 1)) * 4;
      if (isGreenScreen(rgba[idxRight], rgba[idxRight+1], rgba[idxRight+2])) {
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
            if (isGreenScreen(rgba[nPixelIdx], rgba[nPixelIdx+1], rgba[nPixelIdx+2])) {
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
            rgba[idx + 3] = Math.round(rgba[idx + 3] * 0.45);
          }
        }
      }
    }

    await sharp(Buffer.from(rgba), {
      raw: { width, height, channels: 4 }
    })
    .png()
    .toFile(outputPath);

    console.log(`[Strict Green BG] Saved ${outputPath}. Transparent pixels: ${transparentCount} (${((transparentCount / (width * height)) * 100).toFixed(1)}%)`);
  } catch (err) {
    console.error(`Error keying green screen for alpaca:`, err);
  }
}

async function main() {
  console.log("Submitting green-screen alpaca job to AI Horde...");
  try {
    const jobId = await submitJob();
    console.log(`Submitted dividend (alpaca) -> Job ID: ${jobId}`);
    
    let done = false;
    while (!done) {
      await new Promise(r => setTimeout(r, 10000));
      const status = await checkStatus(jobId);
      if (status.done) {
        console.log("Job for alpaca is DONE! Downloading image...");
        if (status.generations && status.generations.length > 0) {
          const imgData = status.generations[0].img;
          const rawFile = 'res_dividend_raw.png';
          const outFile = 'res_dividend.png';
          
          if (imgData.startsWith('http')) {
            await downloadFile(imgData, rawFile);
          } else {
            const base64Str = imgData.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFileSync(rawFile, Buffer.from(base64Str, 'base64'));
          }
          
          console.log("Keying out green background for alpaca...");
          await removeBackgroundGreenOnly(rawFile, outFile);
          done = true;
        }
      } else {
        console.log(`Alpaca status: queue_pos=${status.queue_position}, wait_time=${status.wait_time}s`);
      }
    }
    console.log("Alpaca image generated and keyed out successfully!");
  } catch (err) {
    console.error("Failed to run alpaca generation:", err);
  }
}

main();
