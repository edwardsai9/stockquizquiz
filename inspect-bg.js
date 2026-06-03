const sharp = require('sharp');

async function inspect(filePath) {
  try {
    const image = sharp(filePath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Sample corners
    const corners = [
      { name: 'Top-Left', x: 0, y: 0 },
      { name: 'Top-Right', x: info.width - 1, y: 0 },
      { name: 'Bottom-Left', x: 0, y: info.height - 1 },
      { name: 'Bottom-Right', x: info.width - 1, y: info.height - 1 }
    ];
    
    console.log(`--- Inspecting ${filePath} (${info.width}x${info.height}, channels: ${info.channels}) ---`);
    for (const c of corners) {
      const idx = (c.y * info.width + c.x) * info.channels;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      console.log(`${c.name} (${c.x}, ${c.y}): RGB(${r}, ${g}, ${b})`);
    }

    // Count pixel color distances from corner (0,0) color
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    const dists = [];
    for (let i = 0; i < info.width * info.height; i++) {
      const idx = i * info.channels;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
      dists.push(dist);
    }

    dists.sort((a, b) => a - b);
    console.log("Percentiles of pixel distance from (0,0) color:");
    for (let pct of [10, 20, 30, 40, 50, 60, 70, 80, 90]) {
      const val = dists[Math.floor((pct / 100) * dists.length)];
      console.log(`  ${pct}%: ${val.toFixed(2)}`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await inspect('res_passive_raw.png');
  await inspect('res_dividend_raw.png');
  await inspect('res_value_raw.png');
  await inspect('res_momentum_raw.png');
  await inspect('res_short_raw.png');
  await inspect('res_leverage_raw.png');
}

run();
