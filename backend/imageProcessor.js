var Lwip    = require('lwip');
var Async   = require('async');

function rotateIage(image, degrees, mainCallback) {

    image.rotate(degrees, function(err, image) {
        if(err) return mainCallback(err);
        mainCallback(null, image);
    });

}

function borderImage(image, width, color, mainCallback) {

    image.border(width, color, function(err, image) {
        if(err) return mainCallback(err);
        mainCallback(null, image);
    });

}

function blurImage(image, sigma, mainCallback) {

    image.blur(sigma, function(err, image) {
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
 * Process an image
 * @param details
 * @param mainCallback
 */
exports.processeImage = function(imageData, process, mainCallback) {

    var imgBuffer = new Buffer(imageData, 'base64');
    var lwipImage;
    var finalImage;

    Async.series([

        function(callback) {

            openImage(imgBuffer, function(err, image) {
                if(err) return callback(err);
                lwipImage = image;
                callback();
            });
        },

        function(callback) {

            switch(process) {
                case 'rotate':

                    rotateIage(lwipImage, 180, function(err, image) {
                        if(err) return callback(err);
                        lwipImage = image;
                        callback();
                    });
                
                    break;
                case 'border':
                    borderImage(lwipImage, 40, 'black', function(err, image) {
                        if(err) return callback(err);
                        lwipImage = image;
                        callback();
                    });
                    break;
                
                case 'blur':
                    blurImage(lwipImage, 5.00, function(err, image) {
                        if(err) return callback(err);
                        lwipImage = image;
                        callback();
                    });
                    break;
                
                default:
                callback('no valid process available');
            }
        },

        function(callback) {

            bufferImage(lwipImage, 'jpg', function(err, buffer) {
                if(err) return callback(err);
                finalImage = buffer.toString('base64');
                callback();
            });
        }


    ], function(err) {
        mainCallback(err, finalImage);
    });

};