const fs = require('fs');
const path = require('path');

const remove = (filePath) => {
    console.log('to delete:', filePath)

    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
        fs.unlinkSync(filePath)
    }

    if (stats.isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true, force: true })
    }
}

const runDirectoryScan = (dir) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            // console.log('\n\n', filePath, dir, file)
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error getting stats of file: ${err}`);
                    return;
                }

                if (
                    stats.isFile() 
                    && file.endsWith('.js')
                    // && dir !== '.'
                    // && file.startsWith('wp-')
                ) {
                    // remove(filePath)
                    console.log('to delete:', filePath)
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file: ${err}`);
                        } else {
                            console.log(`Deleted: ${filePath}`);
                        }
                    });
                }

                if (stats.isDirectory()) {
                    
                        runDirectoryScan(filePath);
                }
            });
        });
    });
};

// Replace 'your_directory_path' with the path to the directory you want to clean
const directoryPath = 'src';
runDirectoryScan(directoryPath);