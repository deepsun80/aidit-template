import { fetchGoogleDriveFiles } from '../lib/googleDrive';

async function test() {
  const files = await fetchGoogleDriveFiles();
  console.log('Drive Files:', files);
}

test();
