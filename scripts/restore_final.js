const fs = require('fs');
const path = require('path');

const srcBrainTiles = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\fb17e4b3-734c-4ca0-b52a-a309b491deea';
const srcBrainImages = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\3f9e3dfb-eb2c-4484-a732-bde249ca881d';

const destAssetsDir = 'C:\\Me\\Proj\\Eternal Dungeon\\assets';
const destTilesDir = path.join(destAssetsDir, 'tiles');
const destImagesDir = path.join(destAssetsDir, 'images');
const destAudioDir = path.join(destAssetsDir, 'audio');

// 1. Ensure destination directories exist
[destAssetsDir, destTilesDir, destImagesDir, destAudioDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// 2. Define files to copy
const copies = [
    // Tiles
    { src: path.join(srcBrainTiles, 'floor_tile_1774974777883.png'), dest: path.join(destTilesDir, 'floor.png') },
    { src: path.join(srcBrainTiles, 'wall_tile_1774974837964.png'), dest: path.join(destTilesDir, 'wall.png') },
    { src: path.join(srcBrainTiles, 'player_sprite_1774974865103.png'), dest: path.join(destTilesDir, 'player.png') },
    // Images (Battlefields)
    { src: path.join(srcBrainImages, 'forest_battlefield_1774934781460.png'), dest: path.join(destImagesDir, 'forest.png') },
    { src: path.join(srcBrainImages, 'ruined_village_battlefield_1774934813732.png'), dest: path.join(destImagesDir, 'village.png') },
    { src: path.join(srcBrainImages, 'dungeon_battlefield_1774935543435.png'), dest: path.join(destImagesDir, 'dungeon.png') }
];

// 3. Execute copies
copies.forEach(c => {
    if (fs.existsSync(c.src)) {
        fs.copyFileSync(c.src, c.dest);
        console.log(`✅ Copied: ${path.basename(c.src)} -> ${c.dest}`);
    } else {
        console.error(`❌ Source missing: ${c.src}`);
    }
});

// 4. Create dummy files for icons if they don't exist or are empty/dummy 17-bytes
['favicon.png', 'icon.png', 'splash.png', 'adaptive-icon.png'].forEach(f => {
    const p = path.join(destAssetsDir, f);
    if (!fs.existsSync(p)) {
        fs.writeFileSync(p, 'DUMMY_DATA_FOR_METRO_BUNDLER_TO_FIND_FILE_XX');
        console.log(`⚠️ Created dummy: ${f}`);
    } else {
        console.log(`✅ Exists: ${f}`);
    }
});

console.log('--- Restoration node script finished ---');
