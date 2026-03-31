import { generateEnemy } from './engine';

// Tile types
export const TILES = {
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
};

function fillGrid(w, h, type) {
  const grid = [];
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      row.push(type);
    }
    grid.push(row);
  }
  return grid;
}

export function generateMap(depth, width = 30, height = 30) {
  const grid = fillGrid(width, height, TILES.WALL);
  const rooms = [];
  
  // Very simplistic BSP / random room placement
  const numRooms = 5 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numRooms; i++) {
    const roomW = Math.floor(Math.random() * 6) + 4; // 4 to 9 wide
    const roomH = Math.floor(Math.random() * 6) + 4; // 4 to 9 tall
    const roomX = Math.floor(Math.random() * (width - roomW - 2)) + 1;
    const roomY = Math.floor(Math.random() * (height - roomH - 2)) + 1;

    // Carve room
    for (let y = roomY; y < roomY + roomH; y++) {
      for (let x = roomX; x < roomX + roomW; x++) {
        grid[y][x] = TILES.FLOOR;
      }
    }

    const newRoom = { x: roomX, y: roomY, w: roomW, h: roomH, cx: Math.floor(roomX + roomW/2), cy: Math.floor(roomY + roomH/2) };

    // Connect to previous room
    if (rooms.length > 0) {
      const prev = rooms[rooms.length - 1];
      // Carve corridor
      let cx = prev.cx;
      let cy = prev.cy;
      while (cx !== newRoom.cx) {
        grid[cy][cx] = TILES.FLOOR;
        cx += (newRoom.cx > cx ? 1 : -1);
      }
      while (cy !== newRoom.cy) {
        grid[cy][cx] = TILES.FLOOR;
        cy += (newRoom.cy > cy ? 1 : -1);
      }
    }
    rooms.push(newRoom);
  }

  // Place player in the first room
  const startRoom = rooms[0];
  const playerPos = { x: startRoom.cx, y: startRoom.cy };

  // Generate enemies in other rooms
  const enemiesOnMap = [];
  for (let i = 1; i < rooms.length; i++) {
    // 70% chance to put an enemy in a room
    if (Math.random() < 0.7) {
      const room = rooms[i];
      const enemyStats = generateEnemy(depth);
      enemiesOnMap.push({
        ...enemyStats,
        x: room.cx,
        y: room.cy,
        id: `enemy-${Date.now()}-${i}`
      });
    }
  }

  return {
    grid,
    width,
    height,
    playerPos,
    enemiesOnMap
  };
}
