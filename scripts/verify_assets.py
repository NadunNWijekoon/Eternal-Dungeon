import os

def check_assets():
    assets_to_check = [
        "assets/tiles/wall.png",
        "assets/tiles/floor.png",
        "assets/tiles/player.png",
        "assets/images/forest.png",
        "assets/images/dungeon.png",
        "assets/images/village.png",
        "assets/icon.png",
        "assets/splash.png",
        "assets/favicon.png",
        "assets/adaptive-icon.png",
        "assets/audio/slash.wav",
        "assets/audio/hit.wav",
        "assets/audio/ui.wav",
        "assets/audio/win.wav"
    ]
    
    with open("assets_status.txt", "w") as f:
        f.write("A-E Asset Check Results:\n")
        for asset in assets_to_check:
            exists = os.path.exists(asset)
            f.write(f"{asset}: {'READY' if exists else 'MISSING'}\n")
            if exists:
                f.write(f"  Size: {os.path.getsize(asset)} bytes\n")

if __name__ == "__main__":
    check_assets()
