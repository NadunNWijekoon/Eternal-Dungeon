import subprocess
import sys

def ensure_pil():
    try:
        from PIL import Image
        print("Pillow is already installed.")
    except ImportError:
        print("Pillow not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        print("Pillow installed successfully.")

if __name__ == "__main__":
    ensure_pil()
