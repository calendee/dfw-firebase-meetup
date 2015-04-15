var Firebase        = require('firebase');
var Firelease       = require('firelease');
var NodeFire        = require('nodefire');
var ImageProcesor   = require('./imageProcessor.js');
var Async           = require('async');
var Q               = require('q');

NodeFire.setCacheSize(10);
NodeFire.DEBUG = true;

var fireleaseOptions = {
    "maxConcurrent" : 5,
    "bufferSize"    : 5,
    "minLease"      : 10000,
    "maxLease"      : 35000
};


var nfRef = new NodeFire('https://dfw-firebase.firebaseio.com');

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

            nfRef.child('201504/photos').push({
                imageData       : scaledImage,
                queueTs         : queueTs,
                ts              : Firebase.ServerValue.TIMESTAMP,
                sizeOriginal    : imageData.length,
                sizeScaled      : scaledImage.length
            }).then(
                function() {
                    console.log("Finished pushing image");
                    callback();
                }
            );

        }

    ], function(err, results) {
        console.log("All process queue steps completed");
        callback(err);
    })

}


Firelease.attachWorker(nfRef.child('201504/queue'), fireleaseOptions, function(snap) {

    var deferred = Q.defer();

    var start = Date.now();
    console.log("\nStart : " + start );

    processQueue(snap.$ref.key(), snap.ts, snap.imageData, function(err, results) {
        var finished = Date.now();
        console.log("Completed : " + finished + ", Elapsed : " + ( finished - start) + " ms" );
        deferred.resolve();
    });

    return deferred.promise;

})