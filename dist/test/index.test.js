import { dirname } from 'path';
import { fileURLToPath } from 'url';
console.log(dirname(fileURLToPath(import.meta.url)));
test('__dirname', () => {
    // const p = dirname(fileURLToPath(import.meta.url));
    // expect(__dirname(import.meta)).tobe;
});
