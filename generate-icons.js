const fs = require('fs');
const zlib = require('zlib');

/* ---------- PNG encoder (no dependencies) ---------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  const raw = Buffer.alloc(height * (1 + width * 4));
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0; // filter type 0
    for (let x = 0; x < width * 4; x++) raw[o++] = rgba[y * width * 4 + x];
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

/* ---------- Drawing ---------- */

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

const BG_TOP = [0x1a, 0x22, 0x38];
const BG_BOT = [0x0d, 0x13, 0x22];
const GOLD_TOP = [0xe5, 0xc4, 0x83];
const GOLD_BOT = [0x9a, 0x77, 0x30];
const RING = [0xc5, 0xa0, 0x59];

function renderIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const c = size / 2;
  const rr = size * 0.20;          // rounded-corner radius
  const ringR = size * 0.36;       // gold ring radius
  const ringW = size * 0.030;      // ring thickness
  const heart = size * 0.235;      // heart scale

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Rounded-rect background with soft AA edge
      const ddx = Math.max(Math.abs(x - c) - (c - rr), 0);
      const ddy = Math.max(Math.abs(y - c) - (c - rr), 0);
      const dRect = Math.hypot(ddx, ddy) - rr;
      const covBg = clamp(0.5 - dRect);
      if (covBg <= 0) continue;

      const t = y / size;
      let r = lerp(BG_TOP[0], BG_BOT[0], t);
      let g = lerp(BG_TOP[1], BG_BOT[1], t);
      let b = lerp(BG_TOP[2], BG_BOT[2], t);

      // Gold ring
      const dC = Math.hypot(x - c, y - c);
      const covRing = clamp(0.5 - (Math.abs(dC - ringR) - ringW / 2));
      if (covRing > 0) {
        r = lerp(r, RING[0], covRing);
        g = lerp(g, RING[1], covRing);
        b = lerp(b, RING[2], covRing);
      }

      // Gold heart (screen coords, point down)
      const hx = (x - c) / heart;
      const hy = (y - c) / heart;
      const f = Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * Math.pow(-hy, 3);
      const covHeart = clamp(0.5 - f * 6);
      if (covHeart > 0) {
        const ht = clamp((hy + 1.2) / 2.4);
        r = lerp(r, lerp(GOLD_TOP[0], GOLD_BOT[0], ht), covHeart);
        g = lerp(g, lerp(GOLD_TOP[1], GOLD_BOT[1], ht), covHeart);
        b = lerp(b, lerp(GOLD_TOP[2], GOLD_BOT[2], ht), covHeart);
      }

      const o = (y * size + x) * 4;
      px[o] = r;
      px[o + 1] = g;
      px[o + 2] = b;
      px[o + 3] = Math.round(covBg * 255);
    }
  }
  return px;
}

const outDir = 'assets/icons';
fs.mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const rgba = renderIcon(size);
  const png = encodePNG(size, size, rgba);
  fs.writeFileSync(`${outDir}/icon-${size}.png`, png);
  console.log(`icon-${size}.png written (${png.length} bytes)`);
}
