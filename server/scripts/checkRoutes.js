import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = path.join(__dirname, '../routes');
const routes = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

async function checkRoutes() {
    for (const file of routes) {
        try {
            await import(`../routes/${file}?update=${Date.now()}`);
        } catch (err) {
            console.error(`ERROR_IN_FILE: ${file}`);
            console.error(err);
            console.log('---END_OF_ERROR---');
        }
    }
}

checkRoutes();
