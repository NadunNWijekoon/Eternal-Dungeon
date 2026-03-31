const fs = require('fs');
fs.mkdirSync('assets/images', { recursive: true });
const f1 = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\3f9e3dfb-eb2c-4484-a732-bde249ca881d\\forest_battlefield_1774934781460.png';
const f2 = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\3f9e3dfb-eb2c-4484-a732-bde249ca881d\\ruined_village_battlefield_1774934813732.png';
const f3 = 'C:\\Users\\Nadun N. Wijekoon\\.gemini\\antigravity\\brain\\3f9e3dfb-eb2c-4484-a732-bde249ca881d\\dungeon_battlefield_1774935543435.png';
fs.copyFileSync(f1, 'assets/images/forest.png');
fs.copyFileSync(f2, 'assets/images/village.png');
fs.copyFileSync(f3, 'assets/images/dungeon.png');
console.log('done copying');
