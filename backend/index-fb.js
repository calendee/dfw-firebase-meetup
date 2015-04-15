var Firebase        = require('firebase');
var ImageProcesor   = require('./imageProcessor.js');
var Async           = require('async');

var queueRef = new Firebase('https://dfw-firebase.firebaseio.com/201504/queue');
var photosRef = new Firebase('https://dfw-firebase.firebaseio.com/201504/photos');

function processQueue(id, queueTs, imageData, callback) {

    var originalSize = imageData.length;

    console.log("Processing queue id : " + id);

    Async.waterfall([

        function resize(callback) {

            console.log("Resizing Image");
            ImageProcesor.processImage(imageData, callback);

        },

        function upload(scaledImage, callback) {

            console.log("Original Size : " + originalSize);
            console.log("Scaled Size : " + scaledImage.length);

            var reduction = ((1 - scaledImage.length/originalSize) * 100).toFixed(2) + "%";
            console.log("Reduction : " + reduction);

            console.log("Uploading Image");

            photosRef.push({
                imageData       : scaledImage,
                queueTs         : queueTs,
                ts              : Firebase.ServerValue.TIMESTAMP,
                sizeOriginal    : imageData.length,
                sizeScaled      : scaledImage.length
            }, function(err) {
                console.log("Image Uploaded");

                callback(err);
            });

        },

        function deleteQueue(callback) {

            console.log("Deleting Queue Record");
            queueRef.child(id).set(null, function(err) {
                callback(err);
            });

        }

    ], function(err, results) {
        callback(err);
    })

}

queueRef.on("child_added", function(snapshot) {

    var start = Date.now();
    console.log("\nStart : " + start );
    var queueRecord = snapshot.val();

    processQueue(snapshot.key(), queueRecord.ts, queueRecord.imageData, function(err, results) {
        var finished = Date.now();
        console.log("Completed : " + finished + ", Elapsed : " + ( finished - start) + " ms" );
    });

});