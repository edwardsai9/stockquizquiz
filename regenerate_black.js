const https = require('https');
const fs = require('fs');

const API_KEY = '0000000000';
const CLIENT_AGENT = 'stock-strategy-quiz:1.0.0:developer@gmail.com';

const items = [
  {
    name: 'momentum',
    prompt: "A majestic 3D golden metallic flying eagle statue, surfing on a rising golden neon chart line, glowing amber eyes, wings spread wide, hyper-detailed, masterpiece, professional 3D CGI render, isolated on a solid pure black background. ### shadow, floor, gradient, table, pedestal, ground"
  },
  {
    name: 'dividend',
    prompt: "A luxury 3D golden metallic alpaca statue, smiling, carrying small chest of gold coins and emeralds, glowing emerald green eyes, hyper-detailed, masterpiece, professional 3D CGI render, isolated on a solid pure black background. ### shadow, floor, gradient, table, pedestal, ground"
  }
];

function submitJob(item) {
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
  console.log("Submitting solid black background image generation jobs to AI Horde...");
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
    await new Promise(r => setTimeout(r, 12000));

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
            
            // Save raw image directly to the final file name (NO background removal)
            if (imgData.startsWith('http')) {
              await downloadFile(imgData, job.outFile);
              fs.copyFileSync(job.outFile, job.rawFile); // Keep raw backup too
              console.log(`Downloaded raw image from URL directly to final output for ${job.name}`);
            } else {
              const base64Str = imgData.replace(/^data:image\/\w+;base64,/, "");
              const buffer = Buffer.from(base64Str, 'base64');
              fs.writeFileSync(job.outFile, buffer);
              fs.writeFileSync(job.rawFile, buffer);
              console.log(`Saved raw base64 image directly to final output for ${job.name}`);
            }

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

  console.log("\nBoth black background images regenerated and saved directly successfully!");
}

main().catch(console.error);
