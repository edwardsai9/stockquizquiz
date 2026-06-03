const { Jimp } = require('jimp');

async function main() {
  try {
    const jpg = await Jimp.read('q2.jpg');
    const png = await Jimp.read('q2.png');
    
    const coordinates = [
      { x: 512, y: 512 },
      { x: 250, y: 250 },
      { x: 750, y: 750 },
      { x: 100, y: 500 }
    ];
    
    for (const c of coordinates) {
      const idx = (c.y * 1024 + c.x) * 4;
      const jR = jpg.bitmap.data[idx];
      const jG = jpg.bitmap.data[idx+1];
      const jB = jpg.bitmap.data[idx+2];
      
      const pR = png.bitmap.data[idx];
      const pG = png.bitmap.data[idx+1];
      const pB = png.bitmap.data[idx+2];
      const pA = png.bitmap.data[idx+3];
      
      console.log(`x=${c.x}, y=${c.y} -> JPG: RGB(${jR},${jG},${jB}) | PNG: RGBA(${pR},${pG},${pB},${pA})`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
