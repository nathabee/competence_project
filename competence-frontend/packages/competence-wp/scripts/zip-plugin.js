const { execSync } = require('child_process');
const path = require('path');

const pluginDir = path.resolve(__dirname, '../competence-wp');
const zipPath = path.resolve(__dirname, '../competence-wp.zip');

try {
  execSync(`zip -r ${zipPath} .`, { cwd: pluginDir });
  console.log(`✅ Plugin zipped to ${zipPath}`);
} catch (err) {
  console.error('❌ Failed to zip plugin:', err.message);
}
