import fs from 'node:fs/promises';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = path.join(root, 'assets', 'brand');
const imageDir = path.join(root, 'assets', 'images');
const sourcePath = path.join(brandDir, 'brooklyn-college-seal.svg');
const maroon = '#862633';
const cream = '#F7F3EA';

await fs.mkdir(imageDir, { recursive: true });

const source = await fs.readFile(sourcePath, 'utf8');
const recolor = (color) => Buffer.from(source.replaceAll('#000000', color).replaceAll('#000', color));
const maroonSeal = recolor(maroon);

async function sealPng(svg, size) {
  return sharp(svg).resize(size, size, { fit: 'contain' }).png().toBuffer();
}

async function iconCanvas(background, sealBuffer, output, sealSize = 744) {
  const fittedSeal = await sharp(sealBuffer).resize(sealSize, sealSize, { fit: 'contain' }).png().toBuffer();
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background } })
    .composite([{ input: fittedSeal, gravity: 'center' }])
    .png()
    .toFile(output);
}

const renderedSeal = await sealPng(maroonSeal, 512);
// The legacy source has one full-width guide pixel at its top and bottom edge.
const rendered = await sharp(renderedSeal).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let x = 0; x < rendered.info.width; x += 1) {
  rendered.data[(x * 4) + 3] = 0;
  rendered.data[(((rendered.info.height - 1) * rendered.info.width + x) * 4) + 3] = 0;
}
const maroonSealPng = await sharp(rendered.data, { raw: rendered.info }).png().toBuffer();
const sealAlpha = await sharp(maroonSealPng).extractChannel('alpha').toBuffer();
const whiteSealPng = await sharp({ create: { width: 512, height: 512, channels: 3, background: '#FFFFFF' } })
  .joinChannel(sealAlpha)
  .png()
  .toBuffer();

await fs.writeFile(path.join(brandDir, 'seal.png'), maroonSealPng);
await iconCanvas(maroon, whiteSealPng, path.join(imageDir, 'icon.png'));
await iconCanvas({ r: 0, g: 0, b: 0, alpha: 0 }, whiteSealPng, path.join(imageDir, 'android-icon-foreground.png'), 690);
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: maroon } }).png().toFile(path.join(imageDir, 'android-icon-background.png'));
await iconCanvas({ r: 0, g: 0, b: 0, alpha: 0 }, maroonSealPng, path.join(imageDir, 'android-icon-monochrome.png'), 690);

const splashSeal = await sealPng(maroonSeal, 380);
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: cream } })
  .composite([{ input: splashSeal, gravity: 'center' }])
  .png()
  .toFile(path.join(imageDir, 'splash-icon.png'));

await sharp(maroonSeal)
  .resize(128, 128, { fit: 'contain' })
  .flatten({ background: cream })
  .png()
  .toFile(path.join(imageDir, 'favicon.png'));

console.log('Generated Brooklyn College brand assets.');
