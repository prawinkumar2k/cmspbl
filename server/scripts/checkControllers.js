import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const controllersDir = path.join(__dirname, '../controller');
const controllers = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

async function checkControllers() {
    for (const file of controllers) {
        try {
            await import(`../controller/${file}`);
            // console.log(`✅ ${file} is OK`);
        } catch (err) {
            console.error(`❌ Error in ${file}:`);
            console.error(err);
            console.log('-----------------------------------');
        }
    }
}

checkControllers();
