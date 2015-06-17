var Queue = require('firebase-queue');
var Firebase = require('firebase');
var ImageProcessor = require('./imageProcessor');

var ref = new Firebase('https://dfw-firebase.firebaseio.com/201506');
var queueRef = ref.child('queue');


var options = {
  'specId': 'process_save',
  numWorkers : 4
};

var processTask = new Queue(queueRef, options, function(data, progress, resolve, reject) {

  console.log(options.specId + " has data!");
  console.log(data.uid);
  
  ref.child('my-photos').child(data.uid).push(data, function(err) {
    console.log("Saved data");
    console.log(err);
    resolve(data);
  }) 
  
  
});