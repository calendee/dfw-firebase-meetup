var Firebase = require('firebase');
var Fs       = require('fs');
var _        = require('lodash');

var argv = require('yargs')
    .usage('\nUsage: $0 -fbUrl [string] -file [string] -areYouReallyReallyReallySureYouWantToLoadTheWholeSet [string]')
    .demand(['fbUrl', 'file', 'areYouReallyReallyReallySureYouWantToLoadTheWholeSet'])
    .boolean('areYouReallyReallyReallySureYouWantToLoadTheWholeSet')
    .argv;

var fbUrl = argv.fbUrl;
var file = argv.file;
var reallySure = argv.areYouReallyReallyReallySureYouWantToLoadTheWholeSet;

if(!reallySure) {
    console.log('Whew!  I did\'t want to load all of that either!');
    process.exit();
}

var fb = new Firebase(fbUrl);
var weather = JSON.parse(Fs.readFileSync(file, 'utf8'));

var startTime = Date.now();

var counter = 0;
_.forEach(weather, function(report) {

    fb.child('weather').child('tx').push(report, function(err) {
        if(err) console.log(err);

        counter++;

        if(counter%1000 === 0 ) console.log(counter + " records in " + ( (Date.now() - startTime) / 1000) + " seconds");
    });

});

console.log("All done!");
process.exit();