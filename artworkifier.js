const ArtImage = require('./models/artImage');

const { promisify } = require('util')

const mime = require('mime-types');
const sizeOf = promisify(require('image-size'));
const path = require('path');
const fs = require('fs');
const readdir = promisify(require('fs').readdir)

async function loadArtFiles (filePath) {
    let artFiles = [];
    let readFiles = await readdir(filePath, { withFileTypes: true });

    for (const file of readFiles) {
        if (file.isFile())
        {
            let artImage = new ArtImage();

            artImage.fileName = file.name;
            artImage.fullPath = path.join(filePath, file.name);
            artImage.webPath = "/artwork" + artImage.fileName;

            let fileStats = fs.statSync(artImage.fullPath);
            artImage.size = fileStats["size"] / 1048576.0;

            await sizeOf(artImage.fullPath)
                .then( dimensions => {
                    artImage.height = dimensions.height;
                    artImage.width = dimensions.width;
                })
                .catch( err => console.error(err));

            artImage.mimetype = mime.lookup(artImage.fullPath);
            await artImage.loadThumbnail();

            artFiles.push(artImage);
        }
    }

    return artFiles;
}

module.exports.artworkifierInit = async function () {
    const artworkPath = path.join(__dirname, 'public/artwork');
    const artworkThumbnailPath = path.join(__dirname, 'public/artwork/thumbs');

    try {
        fs.mkdirSync(artworkThumbnailPath, { recursive: true })
    } catch(err) {
        console.log("Failed to create directory..." + err);
    }

    let artFiles = await loadArtFiles(artworkPath).then( files => {
        return files;
    });

    for (const thing of artFiles) {
        console.log(thing);
    }
}