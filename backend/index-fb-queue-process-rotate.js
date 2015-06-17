var Queue = require('firebase-queue');
var Firebase = require('firebase');
var ImageProcessor = require('./imageProcessor');

var ref = new Firebase('https://dfw-firebase.firebaseio.com/201506');
var queueRef = ref.child('queue');

var options = {
  'specId': 'process_rotate',
  numWorkers : 4
};

var processTask = new Queue(queueRef, options, function(data, progress, resolve, reject) {

  console.log(options.specId + " has data!");
  
  if(data.rotate) {
    ImageProcessor.processeImage(data.img, 'rotate', function(err, finalImage) {
      
      if(err) {
        reject(err)
      } else {
        data.img = finalImage;
        resolve(data);
        
      }
    });
  } else {
    resolve(data);
  }
  
});