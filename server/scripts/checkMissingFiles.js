import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverJsPath = path.join(__dirname, '../server.js');
const serverJs = fs.readFileSync(serverJsPath, 'utf8');

const importRegex = /import\s+.*\s+from\s+'(.*\.js)';/g;
let match;
const missing = [];

while ((match = importRegex.exec(serverJs)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
        const fullPath = path.resolve(path.dirname(serverJsPath), importPath);
        if (!fs.existsSync(fullPath)) {
            missing.push({ importPath, fullPath });
        }
    }
}

console.log('--- Missing Files ---');
missing.forEach(m => console.log(`${m.importPath} -> ${m.fullPath}`));
