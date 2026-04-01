const fs = require('fs');
const path = require('path');

// 1x1 transparent PNG
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(base64Png, 'base64');

function fixDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            fixDir(p);
        } else if (p.endsWith('.png')) {
            const stats = fs.statSync(p);
            // If it's a dummy text file, its size is very small (like 5 or 17 bytes)
            if (stats.size < 100) {
                fs.writeFileSync(p, buffer);
                console.log('Fixed', p);
            }
        }
    }
}

fixDir(path.join(__dirname, '..', 'assets'));
console.log('Done fixing dummy assets');
