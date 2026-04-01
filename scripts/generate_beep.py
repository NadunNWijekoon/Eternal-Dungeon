import wave
import struct
import math
import os

def generate_beep(filename, frequency=440, duration=0.1, volume=0.5):
    sample_rate = 44100
    n_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(n_samples):
            value = int(volume * 32767.0 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)

def main():
    audio_dir = "C:\\Me\\Proj\\Eternal Dungeon\\assets\\audio"
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    
    generate_beep(os.path.join(audio_dir, "slash.wav"), frequency=880, duration=0.05)
    generate_beep(os.path.join(audio_dir, "hit.wav"), frequency=220, duration=0.1)
    generate_beep(os.path.join(audio_dir, "ui.wav"), frequency=660, duration=0.03)
    generate_beep(os.path.join(audio_dir, "win.wav"), frequency=1320, duration=0.3)
    
    print("Generated beep audio files in assets/audio")

if __name__ == "__main__":
    main()
