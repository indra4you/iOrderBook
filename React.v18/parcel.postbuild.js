const fs = require('fs');
const path = require('path');

const baseUrl = process.env.BASE_URL || '/';
const distDirName = process.env.DIST_DIR_NAME || 'dist';
const filePath = path
    .join(
        __dirname,
        distDirName,
        'index.html'
    );

fs.readFile(
    filePath,
    'utf8',
    (err, data) => {
        if (err) {
            return console.log(err);
        }

        const result = data
            .replace(
                '%BASE_URL%',
                baseUrl
            );

    fs.writeFile(
        filePath,
        result,
        'utf8',
        (err) => {
            if (err) {
                return console.log(err)
            };
        }
    );
});