const fs = require('fs');
const path = require('path');

const baseUrl = process.env.BASE_URL || '/';
const publishDir = process.env.PUBLISH_DIR || '/';
const filePath = path
    .join(
        __dirname,
        publishDir,
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