const https = require('https');
const fs = require('fs');

const API_KEY = '0000000000';
const CLIENT_AGENT = 'stock-strategy-quiz:1.0.0:developer@gmail.com';

const item = {
  name: 'passive',
  prompt: "A luxury 3D golden metallic sloth statue, lying down peacefully, glowing sapphire blue eyes, hyper-detailed, masterpiece, professional 3D CGI render, isolated on a solid pure black background. ### shadow, floor, gradient, table, pedestal, ground"
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

async function main() {
  console.log("Submitting lying standalone sloth job with solid black background to AI Horde...");
  try {
    const jobId = await submitJob();
    console.log(`Submitted passive (sloth) -> Job ID: ${jobId}`);
    
    let done = false;
    while (!done) {
      await new Promise(r => setTimeout(r, 12000));
      const status = await checkStatus(jobId);
      if (status.done) {
        console.log("Job for sloth is DONE! Downloading image...");
        if (status.generations && status.generations.length > 0) {
          const imgData = status.generations[0].img;
          const rawFile = 'res_passive_raw.png';
          const outFile = 'res_passive.png';
          
          if (imgData.startsWith('http')) {
            await downloadFile(imgData, outFile);
            fs.copyFileSync(outFile, rawFile);
            console.log("Downloaded raw image directly to final output res_passive.png");
          } else {
            const base64Str = imgData.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Str, 'base64');
            fs.writeFileSync(outFile, buffer);
            fs.writeFileSync(rawFile, buffer);
            console.log("Saved base64 image directly to final output res_passive.png");
          }
          done = true;
        }
      } else {
        console.log(`Sloth status: queue_pos=${status.queue_position}, wait_time=${status.wait_time}s`);
      }
    }
    console.log("Lying sloth image generated and saved successfully!");
  } catch (err) {
    console.error("Failed to run sloth generation:", err);
  }
}

main();
