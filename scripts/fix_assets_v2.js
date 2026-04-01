const fs = require('fs');
const path = require('path');

// 1x1 transparent PNG base64
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const pngBuffer = Buffer.from(base64Png, 'base64');

function fixAssets(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            fixAssets(fullPath);
        } else if (fullPath.endsWith('.png')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // If it's a dummy text file
            if (content.includes('DUMMY_IMAGE_DATA') || content.trim() === 'DUMMY' || content.length < 100) {
                fs.writeFileSync(fullPath, pngBuffer);
                console.log(`Fixed: ${fullPath}`);
            }
        }
    }
}

const assetsDir = path.join(__dirname, '..', 'assets');
fixAssets(assetsDir);
console.log('Finished fixing dummy assets.');
