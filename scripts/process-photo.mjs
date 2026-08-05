/**
 * scripts/process-photo.mjs
 * Converts assets/profile.png → assets/profile-bw.png
 * B&W, 400×400, center-cropped.
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Detect if sharp is installed; install if not
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('sharp not found — installing...');
  execSync('npm install sharp --save-dev', { cwd: ROOT, stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

const input = resolve(ROOT, 'assets', 'profile.png');
const output = resolve(ROOT, 'assets', 'profile-bw.png');

console.log(`Processing: ${input}`);

await sharp(input)
  .greyscale()
  .resize(400, 400, { fit: 'cover', position: 'centre' })
  .png()
  .toFile(output);

console.log(`Done: ${output}`);
