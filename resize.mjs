import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';

const folders = ['static/bodas', 'static/ext', 'static/grad', 'static/estudio'];

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
