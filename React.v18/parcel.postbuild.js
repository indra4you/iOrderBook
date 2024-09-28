const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv')

dotenv.config(
    {
        path: path.resolve(__dirname, '.env'),
    },
);

const baseUrl = process.env.BASE_URL || '/';
const distDirName = process.env.DIST_DIR_NAME || 'dist';
console.log('With...');
console.log('- baseUrl:', baseUrl);
console.log('- distDirName:', distDirName);

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
                baseUrl,
            )
            .replace(
                'type="module"',
                '',
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