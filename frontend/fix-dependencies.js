// This script helps fix optional dependencies issues before deployment
// It's meant to be run as part of the build process

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Path to rollup in node_modules
const rollupPkgPath = path.join(
  __dirname,
  'node_modules',
  'rollup',
  'package.json'
);

// Fix rollup's package.json to use WASM instead of native binaries
try {
  if (fs.existsSync(rollupPkgPath)) {
    console.log('📦 Modifying rollup package.json...');
    const pkg = require(rollupPkgPath);
    
    // Remove optionalDependencies that cause issues
    delete pkg.optionalDependencies;
    
    // Add direct dependency on WASM version
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies['@rollup/wasm-node'] = pkg.version;
    
    // Write back the modified package.json
    fs.writeFileSync(rollupPkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ Successfully modified rollup package.json');
  } else {
    console.log('⚠️ Rollup package.json not found, skipping modification');
  }
} catch (error) {
  console.error('❌ Error modifying rollup package.json:', error);
}

console.log('🚀 Dependency fix script completed'); 