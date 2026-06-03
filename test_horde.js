const https = require('https');
const fs = require('fs');

const payload = JSON.stringify({
  prompt: "A 3d golden metallic sloth statue, glowing eyes, temple background, cgi render, highly detailed, 8k",
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
    'apikey': '0000000000',
    'Client-Agent': 'stock-strategy-quiz:1.0.0:developer@gmail.com'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log("POST Response status:", res.statusCode);
    console.log("POST Response body:", body);
  });
});

req.on('error', (e) => {
  console.error("Request error:", e);
});

req.write(payload);
req.end();
