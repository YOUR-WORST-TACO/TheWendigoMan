// import the promisify utility
const {promisify} = require('util')

const path = require('path');
const fs = require('fs');
const sharp = require("sharp");

// make these library functions asynchronous
const readdir = promisify(require('fs').readdir)

/*
ArtImage
    stores info for image files and contains
    useful methods
        - size => the file size of the image (in MBs)
        - height => height in pixels
        - width => width in pixels
        - mimetype => web mimetype of file
        - fileName => filename of image
        - fullPath => path on local storage of image
        - webPath => web accessible path of image
        - thumbnail => web accessible path of image thumbnail
        - thumbnailPath => full path on local machine of image thumbnail
        - landscape => true if image is landscape oriented, otherwise false
        - publishDate => date file was created
 */
class ArtImage {
    constructor(size = 0, height = 0, width = 0, mimetype = "application/octet-stream", fileName = "", fullPath = "", webPath = "", thumbnail = "", thumbnailPath = "", landscape = true, publishDate = Date.now()) {
        this.size = size;
        this.height = height;
        this.width = width;
        this.mimetype = mimetype;
        this.fileName = fileName;
        this.fullPath = fullPath;
        this.webPath = webPath;
        this.thumbnail = thumbnail;
        this.thumbnailPath = thumbnailPath;
        this.landscape = landscape;
        this.publishDate = publishDate;
    }

    /*
    loadThumbnail
        Asynchronous function that loads or creates thumbnails for the object
     */
    async loadThumbnail() {
        const artworkThumbnailPath = path.join(path.dirname(this.fullPath), '/thumbs');
        let thumbnailName = this.fileName + ".png";

        this.thumbnail = "/artwork/thumbs/" + thumbnailName;
        this.thumbnailPath = path.join(artworkThumbnailPath, thumbnailName);

        let thumbFiles = await readdir(artworkThumbnailPath);
        let found = false;
        // attempt to find thumbnail by file name
        for (const file of thumbFiles) {
            if (file === thumbnailName) {
                found = true;
            }
        }

        // if we make it here we need to generate a thumbnail
        if (!found) {
            const maxFileDimension = 600; // we can change this based on our design changes
            this.thumbnailPath = path.join(artworkThumbnailPath, thumbnailName);
            if ( this.height > this.width && this.height > maxFileDimension ) { // portrait
                // make it fit within our specifications
                await sharp(this.fullPath)
                    .resize({ height: 600 })
                    .toFile(this.thumbnailPath);

            } else if ( this.width >= this.height && this.width > maxFileDimension ) { // landscape
                // make it fit within our specifications
                await sharp(this.fullPath)
                    .resize({ width: 600 })
                    .toFile(this.thumbnailPath);
            }
        }
    }
}

// expose ArtImage to the rest of the program
module.exports = ArtImage;