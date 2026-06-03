const { Jimp } = require('jimp');

async function main() {
  try {
    const image = await Jimp.read('intro-hero.png');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    console.log(`Image dimensions: ${width}x${height}`);
    
    // Check border pixels (x=0, x=width-1, y=0, y=height-1)
    let opaqueBorders = 0;
    let whiteBorders = 0;
    
    for (let x = 0; x < width; x++) {
      checkBorderPixel(x, 0, 'Top');
      checkBorderPixel(x, height - 1, 'Bottom');
    }
    for (let y = 0; y < height; y++) {
      checkBorderPixel(0, y, 'Left');
      checkBorderPixel(width - 1, y, 'Right');
    }
    
    function checkBorderPixel(x, y, side) {
      const idx = (y * width + x) * 4;
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx+1];
      const b = image.bitmap.data[idx+2];
      const a = image.bitmap.data[idx+3];
      
      if (a > 0) {
        opaqueBorders++;
        const dist = Math.sqrt(
          Math.pow(r - 255, 2) + 
          Math.pow(g - 255, 2) + 
          Math.pow(b - 255, 2)
        );
        if (dist < 80) {
          whiteBorders++;
          if (whiteBorders < 30) {
            console.log(`Opaque light pixel on ${side} border at (${x},${y}): RGB(${r},${g},${b}) alpha:${a}`);
          }
        }
      }
    }
    
    console.log(`\nTotal opaque border pixels: ${opaqueBorders}`);
    console.log(`Total white/light opaque border pixels: ${whiteBorders}`);
    
  } catch (err) {
    console.error(err);
  }
}

main();
