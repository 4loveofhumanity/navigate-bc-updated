// Launches the Expo web dev server from the mobile/ workspace regardless of the
// process's starting cwd. Used by .claude/launch.json for the in-app preview.
const path = require('path');

const mobileDir = path.join(__dirname, '..', 'mobile');
process.chdir(mobileDir);

const cli = path.join(mobileDir, 'node_modules', 'expo', 'bin', 'cli');
process.argv = [process.argv[0], cli, 'start', '--web', '--port', '8651'];
require(cli);
