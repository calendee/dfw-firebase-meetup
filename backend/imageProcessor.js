var Lwip    = require('lwip');
var Async   = require('async');

function scaleImage(image, ratio, mainCallback) {

    image.scale(ratio, function(err, image) {
        if(err) return mainCallback(err);
        mainCallback(null, image);
    });

}

function bufferImage(image, format, mainCallback) {

    image.toBuffer(format, function(err, buffer) {
        if(err) return mainCallback(err);
        mainCallback(null, buffer);
    });

}

function openImage(buffer, mainCallback) {

    Lwip.open(buffer, 'jpg', function(err, image) {
        if(err) return mainCallback(err);
        mainCallback(null, image);
    });

}

/**
 * Generate a smaller image
 * @param details
 * @param mainCallback
 */
function generateScaledImage(imageData, mainCallback) {

    var imgBuffer = new Buffer(imageData, 'base64');
    var lwipImage;
    var smallImage;

    Async.series([

        function(callback) {

            openImage(imgBuffer, function(err, image) {
                if(err) return callback(err);
                lwipImage = image;

                callback();
            });
        },

        function(callback) {

            scaleImage(lwipImage, 0.25, function(err, image) {
                if(err) return callback(err);
                lwipImage = image;

                callback();
            });
        },

        function(callback) {

            bufferImage(lwipImage, 'jpg', function(err, buffer) {
                if(err) return callback(err);
                smallImage = buffer;

                callback();
            });
        }


    ], function(err) {
        mainCallback(err, smallImage);
    });

}

exports.processImage = function(imageData, callback) {

    try{

        generateScaledImage(imageData, function(err, scaledImage) {
            callback(err, scaledImage.toString('base64'));
        });


    } catch(e) {
        console.warn("imageProcessor Exception");
        console.warn(e);
        console.warn(e.stack)
        exportCallback("imageProcessor Exception");
    }

};