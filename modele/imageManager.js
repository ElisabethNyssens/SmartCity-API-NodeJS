const uuid = require('uuid');
const sharp = require("sharp");


module.exports.saveImage = async (imageBuffer, destination) => {
    return sharp(imageBuffer)
    .jpeg()
    .resize({
        fit: 'inside',
        width: 1920,
        height: 1080
    })
    .toFile(destination);
};