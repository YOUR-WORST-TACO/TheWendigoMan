const {promisify} = require('util')

const path = require('path');
const fs = require('fs');
const sharp = require("sharp");

const readdir = promisify(require('fs').readdir)

class ArtImage {
    constructor(size = 0, height = 0, width = 0, mimetype = "application/octet-stream", fileName = "", fullPath = "", webPath = "", thumbnail = "", thumbnailPath = "") {
        this.size = size;
        this.height = height;
        this.width = width;
        this.mimetype = mimetype;
        this.fileName = fileName;
        this.fullPath = fullPath;
        this.webPath = webPath;
        this.thumbnail = thumbnail;
        this.thumbnailPath = thumbnailPath;
    }

    async loadThumbnail() {
        const artworkThumbnailPath = path.join(path.dirname(this.fullPath), '/thumbs');
        let thumbnailName = this.fileName + ".png";

        this.thumbnail = "/artwork/thumbs/" + thumbnailName;
        this.thumbnailPath = path.join(artworkThumbnailPath, thumbnailName);

        let thumbFiles = await readdir(artworkThumbnailPath);
        let found = false;
        for (const file of thumbFiles) {
            if (file === thumbnailName) {
                found = true;
            }
        }

        // if we make it here we need to generate a thumbnail
        if (!found) {
            const maxFileDimension = 600;
            this.thumbnailPath = path.join(artworkThumbnailPath, thumbnailName);
            if ( this.height > this.width && this.height > maxFileDimension ) { //
                await sharp(this.fullPath)
                    .resize({ height: 600 })
                    .toFile(this.thumbnailPath);

            } else if ( this.width >= this.height && this.width > maxFileDimension ) { // landscape
                await sharp(this.fullPath)
                    .resize({ width: 600 })
                    .toFile(this.thumbnailPath);
            }
        }
    }
}

module.exports = ArtImage;