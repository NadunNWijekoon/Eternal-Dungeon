const fs = require('fs');
const path = require('path');

const sampleRate = 44100;

function writeWav(filename, samples) {
    const buffer = Buffer.alloc(44 + samples.length * 2);
    // RIFF chunk descriptor
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + samples.length * 2, 4);
    buffer.write('WAVE', 8);
    // fmt sub-chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Subchunk1Size
    buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(1, 22); // NumChannels
    buffer.writeUInt32LE(sampleRate, 24); // SampleRate
    buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
    buffer.writeUInt16LE(2, 32); // BlockAlign
    buffer.writeUInt16LE(16, 34); // BitsPerSample
    // data sub-chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(samples.length * 2, 40);
    
    for (let i = 0; i < samples.length; i++) {
        let val = Math.max(-1, Math.min(1, samples[i]));
        buffer.writeInt16LE(val * 32767, 44 + i * 2);
    }
    
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filename, buffer);
    console.log('Saved', filename);
}

// 1. Slash (short noisy swish, ~150ms)
let slashSamples = [];
for (let i = 0; i < sampleRate * 0.15; i++) {
    const t = i / sampleRate;
    const noise = (Math.random() * 2 - 1);
    const envelope = Math.exp(-t * 20);
    slashSamples.push(noise * envelope * 0.6);
}
writeWav('assets/audio/slash.wav', slashSamples);

// 2. Hit (lower frequency crunch ~250ms)
let hitSamples = [];
for (let i = 0; i < sampleRate * 0.25; i++) {
    const t = i / sampleRate;
    const noise = (Math.random() * 2 - 1);
    const freq = 100 - t * 200;
    const square = Math.sin(2 * Math.PI * Math.max(20, freq) * t) > 0 ? 1 : -1;
    let mixed = noise * 0.6 + square * 0.4;
    const envelope = Math.exp(-t * 15);
    hitSamples.push(mixed * envelope * Math.max(0, 1 - t*4) * 0.7);
}
writeWav('assets/audio/hit.wav', hitSamples);

// 3. UI Beep (High square ~50ms)
let uiSamples = [];
for (let i = 0; i < sampleRate * 0.05; i++) {
    const t = i / sampleRate;
    const freq = 880;
    const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
    const envelope = Math.exp(-t * 40);
    uiSamples.push(square * envelope * 0.4);
}
writeWav('assets/audio/ui.wav', uiSamples);

// 4. Win / Coin (Two quick ascending beeps ~300ms)
let winSamples = [];
for (let i = 0; i < sampleRate * 0.3; i++) {
    const t = i / sampleRate;
    let freq = t < 0.1 ? 880 : 1318.51; 
    const square = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
    let envelope = t < 0.1 ? Math.exp(-t * 30) : Math.exp(-(t - 0.1) * 20);
    winSamples.push(square * envelope * 0.3);
}
writeWav('assets/audio/win.wav', winSamples);
