const ArtImage = require('./models/artImage');

// import the promisify utility
const { promisify } = require('util')

// make these library functions asynchronous
const sizeOf = promisify(require('image-size'));
const readdir = promisify(require('fs').readdir)

const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

/*
loadArtFiles
    Asynchronous function that loads art files from given path.
    returns array of ArtImage objects
 */
async function loadArtFiles (filePath) {
    let artFiles = [];
    let readFiles = await readdir(filePath, { withFileTypes: true });

    for (const file of readFiles) {
        if (file.isFile()) // skip any directory in artfile folder
        {
            let artImage = new ArtImage();

            artImage.fileName = file.name;
            artImage.fullPath = path.join(filePath, file.name);
            artImage.webPath = "/artwork/" + artImage.fileName;

            // get a stat object from file
            let fileStats = fs.statSync(artImage.fullPath);
            artImage.size = fileStats["size"] / 1048576.0;
            artImage.publishDate = fileStats["birthtime"];

            // get dimensions
            await sizeOf(artImage.fullPath)
                .then( dimensions => {
                    artImage.height = dimensions.height;
                    artImage.width = dimensions.width;
                })
                .catch( err => console.error(err));

            // set landscape variable if image is portrait
            if ( artImage.height > artImage.width )
            {
                artImage.landscape = false; // default is true
            }

            // get mimetype
            artImage.mimetype = mime.lookup(artImage.fullPath);

            // call builtin method to get thumbnail
            await artImage.loadThumbnail();

            artFiles.push(artImage);
        }
    }

    return artFiles;
}

/*
artworkifierInit
    Asynchronous function that is called on program start to initialize
    the artworkifier system.
 */
module.exports.artworkifierInit = async function () {
    const artworkPath = path.join(__dirname, 'public/artwork');
    const artworkThumbnailPath = path.join(__dirname, 'public/artwork/thumbs');

    // generate the thumbnail path and artwork path if neither presently exist
    try {
        fs.mkdirSync(artworkThumbnailPath, { recursive: true })
    } catch(err) {
        console.log("Failed to create directory..." + err);
    }

    // call async loadArtFiles
    let artFiles = await loadArtFiles(artworkPath).then( files => {
        return files;
    });

    // development function, remove post release
    for (const thing of artFiles) {
        console.log(thing);
    }

    // export current array of artFiles for access elsewhere
    module.exports.artFiles = artFiles;
}

// export loadArtFiles for access externally
module.exports.loadArtFiles = loadArtFiles;