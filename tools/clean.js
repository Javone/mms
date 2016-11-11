import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  await del(['.tmp', 'public/build/*'], {dot: true});
  await fs.makeDir('public/build');
  await fs.makeDir('public/build/js');
  await fs.makeDir('public/build/css');
  await fs.makeDir('public/build/images');
}

export default clean;
