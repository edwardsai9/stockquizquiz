const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const API_KEY = '0000000000';
const CLIENT_AGENT = 'stock-strategy-quiz:1.0.0:developer@gmail.com';

const items = [
  {
    name: 'passive',
    prompt: "Vibrant stock market sloth slots game icon. A beautiful golden metallic sloth statue, made of glowing golden lines, sleeping, 3D render, isolated on solid black background."
  },
  {
    name: 'dividend',
    prompt: "Vibrant stock market alpaca slots game icon. A beautiful golden metallic alpaca statue, made of glowing golden lines, carrying bags of gold coins, 3D render, isolated on solid black background."
  },
  {
    name: 'value',
    prompt: "Vibrant stock market owl slots game icon. A beautiful golden metallic wise owl statue, made of glowing golden lines, holding a magnifying glass, 3D render, isolated on solid black background."
  },
  {
    name: 'momentum',
    prompt: "Vibrant stock market eagle slots game icon. A beautiful golden metallic eagle statue, made of glowing golden lines, surfing on a rising green chart arrow, 3D render, isolated on solid black background."
  },
  {
    name: 'short',
    prompt: "Vibrant stock market jaguar slots game icon. A beautiful golden metallic jaguar statue, made of glowing golden lines, roaring, surrounded by red lightning, 3D render, isolated on solid black background."
  },
  {
    name: 'leverage',
    prompt: "Vibrant stock market monkey slots game icon. A beautiful golden metallic monkey statue, made of glowing golden lines, winking and holding gold dice, 3D render, isolated on solid black background."
  }
];

// Helper to make POST request to submit job
function submitJob(item) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      prompt: item.prompt,
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

// Helper to check job status
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

// Helper to download image from URL
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

// Run background remover on the raw image
function runBgRemoval(name) {
  return new Promise((resolve, reject) => {
    const rawPath = `res_${name}_raw.png`;
    const outputPath = `res_${name}.png`;
    console.log(`Running background removal for ${name}...`);
    exec(`node remove-bg.js "${rawPath}" "${outputPath}" 65`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Bg removal error for ${name}:`, error);
        reject(error);
      } else {
        console.log(stdout.trim());
        resolve();
      }
    });
  });
}

async function main() {
  console.log("Submitting 6 image generation jobs to AI Horde in parallel...");
  const jobs = [];

  for (const item of items) {
    try {
      const jobId = await submitJob(item);
      console.log(`Submitted ${item.name} -> Job ID: ${jobId}`);
      jobs.push({
        name: item.name,
        id: jobId,
        done: false,
        rawFile: `res_${item.name}_raw.png`,
        outFile: `res_${item.name}.png`
      });
    } catch (err) {
      console.error(`Failed to submit job for ${item.name}:`, err);
    }
  }

  if (jobs.length === 0) {
    console.error("No jobs were submitted successfully. Exiting.");
    return;
  }

  console.log("\nStarting polling loop...");
  let allDone = false;

  while (!allDone) {
    // Wait 15 seconds between polls
    await new Promise(r => setTimeout(r, 15000));

    let activeCount = 0;
    for (const job of jobs) {
      if (job.done) continue;

      activeCount++;
      try {
        const status = await checkStatus(job.id);
        if (status.done) {
          console.log(`Job for ${job.name} is DONE! Downloading image...`);
          if (status.generations && status.generations.length > 0) {
            const imgData = status.generations[0].img;
            if (imgData.startsWith('http')) {
              // It is a URL
              await downloadFile(imgData, job.rawFile);
              console.log(`Downloaded raw image from URL for ${job.name}`);
            } else {
              // It is base64 string
              // Strip metadata if present
              const base64Str = imgData.replace(/^data:image\/\w+;base64,/, "");
              fs.writeFileSync(job.rawFile, Buffer.from(base64Str, 'base64'));
              console.log(`Saved raw image from base64 data for ${job.name}`);
            }

            // Run background remover
            await runBgRemoval(job.name);
            job.done = true;
          } else {
            console.error(`No generation data found for completed job ${job.name}. Retrying status poll.`);
          }
        } else {
          console.log(`Job ${job.name} status: queue_pos=${status.queue_position}, wait_time=${status.wait_time}s`);
        }
      } catch (err) {
        console.error(`Error checking status for ${job.name}:`, err);
      }
    }

    if (activeCount === 0) {
      allDone = true;
    }
  }

  console.log("\nAll images generated and background-removed successfully!");
}

main().catch(console.error);
