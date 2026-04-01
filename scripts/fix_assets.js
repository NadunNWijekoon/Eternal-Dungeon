const fs = require('fs');
const path = require('path');

const root = __dirname.replace(/[\\\/]scripts$/, '');
const assetsDir = path.join(root, 'assets');
const tilesDir = path.join(assetsDir, 'tiles');
const imagesDir = path.join(assetsDir, 'images');
const audioDir = path.join(assetsDir, 'audio');

// 1. Create directories
[tilesDir, imagesDir, audioDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// 2. Restore tiles from previous brain (if possible)
const tilesBrainDir = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\fb17e4b3-734c-4ca0-b52a-a309b491deea';
const tiles = [
    { src: 'floor_tile_1774974777883.png', dest: 'floor.png' },
    { src: 'wall_tile_1774974837964.png', dest: 'wall.png' },
    { src: 'player_sprite_1774974865103.png', dest: 'player.png' }
];

tiles.forEach(t => {
    const srcP = path.join(tilesBrainDir, t.src);
    const destP = path.join(tilesDir, t.dest);
    if (fs.existsSync(srcP)) {
        fs.copyFileSync(srcP, destP);
        console.log(`Restored tile: ${t.dest}`);
    } else {
        console.warn(`Could not find source tile: ${srcP}`);
    }
});

// 3. Restore images from previous brain (if possible)
const imagesBrainDir = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\3f9e3dfb-eb2c-4484-a732-bde249ca881d';
const images = [
    { src: 'forest_battlefield_1774934781460.png', dest: 'forest.png' },
    { src: 'ruined_village_battlefield_1774934813732.png', dest: 'village.png' },
    { src: 'dungeon_battlefield_1774935543435.png', dest: 'dungeon.png' }
];

images.forEach(img => {
    const srcP = path.join(imagesBrainDir, img.src);
    const destP = path.join(imagesDir, img.dest);
    if (fs.existsSync(srcP)) {
        fs.copyFileSync(srcP, destP);
        console.log(`Restored image: ${img.dest}`);
    } else {
        console.warn(`Could not find source image: ${srcP}`);
    }
});

// 4. Create dummy favicon/icon if missing
['favicon.png', 'icon.png', 'splash.png', 'adaptive-icon.png'].forEach(f => {
    const p = path.join(assetsDir, f);
    if (!fs.existsSync(p)) {
        // Just create an empty file if it doesn't exist, as a last resort
        fs.writeFileSync(p, ''); 
        console.log(`Created empty placeholder: ${f}`);
    }
});

console.log('Fix assets script completed.');
