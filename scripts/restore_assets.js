const fs = require('fs');
const path = require('path');

const tilesBrainDir = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\fb17e4b3-734c-4ca0-b52a-a309b491deea';
const imagesBrainDir = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\3f9e3dfb-eb2c-4484-a732-bde249ca881d';

const destTilesDir = 'C:\\Me\\Proj\\Eternal Dungeon\\assets\\tiles';
const destImagesDir = 'C:\\Me\\Proj\\Eternal Dungeon\\assets\\images';
const destAssetsDir = 'C:\\Me\\Proj\\Eternal Dungeon\\assets';

// Ensure directories exist
[destTilesDir, destImagesDir, destAssetsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const copies = [
    { src: path.join(tilesBrainDir, 'floor_tile_1774974777883.png'), dest: path.join(destTilesDir, 'floor.png') },
    { src: path.join(tilesBrainDir, 'wall_tile_1774974837964.png'), dest: path.join(destTilesDir, 'wall.png') },
    { src: path.join(tilesBrainDir, 'player_sprite_1774974865103.png'), dest: path.join(destTilesDir, 'player.png') },
    { src: path.join(imagesBrainDir, 'forest_battlefield_1774934781460.png'), dest: path.join(destImagesDir, 'forest.png') },
    { src: path.join(imagesBrainDir, 'ruined_village_battlefield_1774934813732.png'), dest: path.join(destImagesDir, 'village.png') },
    { src: path.join(imagesBrainDir, 'dungeon_battlefield_1774935543435.png'), dest: path.join(destImagesDir, 'dungeon.png') }
];

copies.forEach(c => {
    try {
        if (fs.existsSync(c.src)) {
            fs.copyFileSync(c.src, c.dest);
            console.log(`Copied ${path.basename(c.src)} to ${c.dest}`);
        } else {
            console.error(`Source missing: ${c.src}`);
        }
    } catch (err) {
        console.error(`Error copying ${c.src}: ${err.message}`);
    }
});

// Create dummy favicon and other brand assets if missing
['favicon.png', 'icon.png', 'splash.png', 'adaptive-icon.png'].forEach(f => {
    const p = path.join(destAssetsDir, f);
    if (!fs.existsSync(p) || fs.statSync(p).size < 100) {
        fs.writeFileSync(p, 'DUMMY');
        console.log(`Created dummy ${f}`);
    }
});

console.log('Restoration complete.');
