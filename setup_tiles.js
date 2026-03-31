const fs = require('fs');
const path = require('path');

const bDir = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\fb17e4b3-734c-4ca0-b52a-a309b491deea';
const destDir = path.join(__dirname, 'assets', 'tiles');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  { src: 'floor_tile_1774974777883.png', dest: 'floor.png' },
  { src: 'wall_tile_1774974837964.png', dest: 'wall.png' },
  { src: 'player_sprite_1774974865103.png', dest: 'player.png' }
];

files.forEach(f => {
  const srcP = path.join(bDir, f.src);
  const destP = path.join(destDir, f.dest);
  if (fs.existsSync(srcP)) {
    fs.copyFileSync(srcP, destP);
    console.log(`Copied ${f.src} to ${f.dest}`);
  } else {
    console.error(`Source not found: ${srcP}`);
  }
});
