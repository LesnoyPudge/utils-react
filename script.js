import fs from 'node:fs';
import path from 'node:path';



const folderPath = './src/hooks';

fs.readdirSync(folderPath).forEach((folder) => {
    const folderDir = path.join(folderPath, folder);

    if (fs.statSync(folderDir).isDirectory()) {
        const testFilePath = path.join(folderDir, `${folder}.test.ts`);

        if (!fs.existsSync(testFilePath)) {
            const fileData = [
                `import { ${folder} } from './${folder}';`,
                '',
                '',
                '',
                `describe('${folder}', () => {`,
                `    it('should fail', () => {`,
                '        expect(true).toBe(false);',
                '    });',
                '});',
            ].join('\n');

            fs.writeFileSync(testFilePath, fileData);
            console.log(`Created ${testFilePath}`);
        }
    }
});