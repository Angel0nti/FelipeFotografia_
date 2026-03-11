import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';

const folders = [
  'static/bodas',
  'static/ext',
  'static/grad',
  'static/estudio',
  'static/eventos',
];

const sizes = [300, 600];

for (const folder of folders) {
  const files = await readdir(folder);
  const avifs = files.filter(f => f.endsWith('.avif') && !f.includes('-'));

  for (const file of avifs) {
    const input = path.join(folder, file);
    const name = file.replace('.avif', '');

    for (const size of sizes) {
      const output = path.join(folder, `${name}-${size}.avif`);
      await sharp(input).resize(size).avif({ quality: 70 }).toFile(output);
      console.log(`✅ ${output}`);
    }
  }
}
await sharp('src/img/video/preview.webp')
  .resize(800, 450, { fit: 'cover' })
  .webp({ quality: 75 })
  .toFile('src/img/video/preview-800.webp');
console.log('✅ preview-800.webp generado');
await sharp('src/img/prof-pic/felipe-pic.avif')
  .resize(300, 300, { fit: 'cover' })
  .avif({ quality: 70 })
  .toFile('src/img/prof-pic/felipe-pic-300.avif');

await sharp('src/img/prof-pic/felipe-pic.avif')
  .resize(300, 300, { fit: 'cover' })
  .webp({ quality: 75 })
  .toFile('src/img/prof-pic/felipe-pic-300.webp');

console.log('✅ felipe-pic-300 generado');
