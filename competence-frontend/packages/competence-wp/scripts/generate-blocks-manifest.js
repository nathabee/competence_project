const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '../competence-wp');
const outputPath = path.join(buildDir, 'blocks-manifest.php');

// Helper: format the PHP array as a string
function formatPhpArray(entries) {
  const lines = Object.entries(entries).map(
    ([key, value]) => `    '${key}' => '${value}'`
  );
  return `<?php
/**
 * Auto-generated blocks manifest for competence-wp
 */

return [
${lines.join(',\n')}
];
`;
}

function varExport(obj, indent = '') {
  if (typeof obj === 'string') {
    return `'${obj.replace(/'/g, "\\'")}'`;
  }
  if (Array.isArray(obj)) {
    return `array(${obj.map(val => varExport(val, indent)).join(', ')})`;
  }
  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
      .map(([key, val]) => `${indent}  '${key}' => ${varExport(val, indent + '  ')}`);
    return `array(\n${entries.join(',\n')}\n${indent})`;
  }
  return String(obj);
}


function generateManifest() {
  const manifest = {};
  const entries = fs.readdirSync(buildDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const blockJsonPath = path.join(buildDir, entry.name, 'block.json');
      if (fs.existsSync(blockJsonPath)) {
        const blockConfig = JSON.parse(fs.readFileSync(blockJsonPath, 'utf8'));
        manifest[entry.name] = blockConfig;
      }
    }
  }

  const phpContent = "<?php\n// Auto-generated blocks manifest for competence-wp\nreturn " +
    varExport(manifest) + ";\n";

  fs.writeFileSync(outputPath, phpContent, 'utf8');
  console.log(`✅ Generated full blocks-manifest.php`);
}


generateManifest();
