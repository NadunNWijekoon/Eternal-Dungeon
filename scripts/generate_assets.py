from PIL import Image, ImageDraw
import os
import random

def create_pixel_tile(filename, size=(32, 32), color=(50, 50, 50), type='floor'):
    img = Image.new('RGB', size, color)
    draw = ImageDraw.Draw(img)
    
    if type == 'floor':
        # Add some grit
        for i in range(100):
            x, y = random.randint(0, size[0]-1), random.randint(0, size[1]-1)
            shade = random.randint(-10, 10)
            c = (max(0, min(255, color[0]+shade)), max(0, min(255, color[1]+shade)), max(0, min(255, color[2]+shade)))
            draw.point((x, y), fill=c)
        # Cracks
        for _ in range(3):
            x1, y1 = random.randint(0, size[0]), random.randint(0, size[1])
            x2, y2 = random.randint(0, size[0]), random.randint(0, size[1])
            draw.line((x1, y1, x2, y2), fill=(30, 30, 30), width=1)
            
    elif type == 'wall':
        # Bricks
        for y in range(0, size[1], 8):
            draw.line((0, y, size[0], y), fill=(20, 20, 20), width=1)
            offset = 0 if (y//8) % 2 == 0 else 8
            for x in range(offset, size[0], 16):
                draw.line((x, y, x, y+8), fill=(20, 20, 20), width=1)
        # Texture
        for i in range(50):
            x, y = random.randint(0, size[0]-1), random.randint(0, size[1]-1)
            shade = random.randint(-20, 10)
            c = (max(0, min(255, color[0]+shade)), max(0, min(255, color[1]+shade)), max(0, min(255, color[2]+shade)))
            draw.point((x, y), fill=c)
            
    elif type == 'player':
        # Minimalist knight
        # Body
        draw.rectangle((8, 12, 24, 28), fill=(100, 100, 100))
        # Helmet
        draw.rectangle((10, 4, 22, 12), fill=(150, 150, 150))
        # Eye slit
        draw.line((12, 8, 20, 8), fill=(20, 20, 20), width=1)
        # Sword
        draw.line((26, 12, 26, 24), fill=(200, 200, 200), width=2)
        draw.point((26, 26), fill=(150, 100, 50)) # Hilt
        
    img.save(filename)

def create_background(filename, size=(256, 256), color=(10, 10, 20), type='dungeon'):
    img = Image.new('RGB', size, color)
    draw = ImageDraw.Draw(img)
    
    if type == 'dungeon':
        # Stone walls motif
        for y in range(0, size[1], 32):
            draw.line((0, y, size[0], y), fill=(30, 30, 40), width=1)
        for x in range(0, size[0], 64):
            draw.line((x, 0, x, size[1]), fill=(30, 30, 40), width=1)
        # Torch glow
        for _ in range(5):
            tx, ty = random.randint(0, size[0]), random.randint(0, size[1])
            for r in range(40, 0, -5):
                alpha = int(255 * (1 - r/40))
                draw.ellipse((tx-r, ty-r, tx+r, ty+r), fill=(100, 60, 20)) # Simplistic glow
                
    elif type == 'forest':
        # Trees
        for _ in range(20):
            tx = random.randint(0, size[0])
            ty = random.randint(100, size[1])
            draw.rectangle((tx-5, ty, tx+5, size[1]), fill=(40, 20, 10))
            draw.ellipse((tx-20, ty-40, tx+20, ty), fill=(10, 50, 20))
            
    elif type == 'village':
        # Houses
        for _ in range(5):
            hx = random.randint(0, size[0]-40)
            hy = random.randint(150, 200)
            draw.rectangle((hx, hy, hx+40, size[1]), fill=(60, 40, 30))
            draw.polygon([(hx, hy), (hx+20, hy-20), (hx+40, hy)], fill=(80, 20, 20))
            
    img.save(filename)

def main():
    tiles_dir = os.path.join("assets", "tiles")
    images_dir = os.path.join("assets", "images")
    assets_dir = "assets"
    
    if not os.path.exists(tiles_dir): os.makedirs(tiles_dir, exist_ok=True)
    if not os.path.exists(images_dir): os.makedirs(images_dir, exist_ok=True)
    if not os.path.exists(assets_dir): os.makedirs(assets_dir, exist_ok=True)
    
    # Tiles
    create_pixel_tile(os.path.join(tiles_dir, "wall.png"), type='wall', color=(40, 45, 50))
    create_pixel_tile(os.path.join(tiles_dir, "floor.png"), type='floor', color=(30, 32, 35))
    create_pixel_tile(os.path.join(tiles_dir, "player.png"), type='player')
    
    # Backgrounds
    create_background(os.path.join(images_dir, "dungeon.png"), type='dungeon', color=(15, 15, 20))
    create_background(os.path.join(images_dir, "forest.png"), type='forest', color=(5, 10, 5))
    create_background(os.path.join(images_dir, "village.png"), type='village', color=(10, 10, 25))
    
    # Icons
    icon = Image.new('RGB', (512, 512), (10, 10, 15))
    draw = ImageDraw.Draw(icon)
    draw.ellipse((100, 100, 412, 412), fill=(180, 20, 20))
    draw.text((150, 230), "ETERNAL\nDUNGEON", fill=(255, 255, 255))
    icon.save(os.path.join(assets_dir, "icon.png"))
    icon.save(os.path.join(assets_dir, "splash.png"))
    icon.save(os.path.join(assets_dir, "favicon.png"))
    icon.save(os.path.join(assets_dir, "adaptive-icon.png"))
    
    print("Generated all images in assets/")

if __name__ == "__main__":
    main()
