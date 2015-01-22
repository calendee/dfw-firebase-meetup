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
var reportCounter = 0;

_.forEach(weather, function(report) {

    var station = report.StationNumber.replace(' ','');

    var info = {
        "station"           : station,
        "date"              : report.ObservationDate,
        "totalPrecipAmt"    : formatPrecip(report.TotalPrecipAmt),
        "newSnowDepth"      : formatPrecip(report.NewSnowDepth),
        "newSnowSWE"        : formatPrecip(report.NewSnowSWE),
        "totalSnowDepth"    : formatPrecip(report.TotalSnowDepth),
        "totalSnowSWE"      : formatPrecip(report.TotalSnowSWE)
    };


    fb.child('weather-all').child('tx').push(report, function(err) {
        if(err) console.log(err);

        reportCompleted();
        counter++;

    });

});

function formatPrecip(data) {

    data = data.toLowerCase();
    if(data.indexOf('t') !== -1 ) return data.replace(' ','');
    if(data.indexOf('na') !== -1 ) return data.replace(' ','');
    return parseFloat(data);

}

function reportCompleted() {

    reportCounter++;

    if(counter%1000 === 0 ) console.log(counter + " records uploaded in " + ( (Date.now() - startTime) / 1000) + " seconds");

    if(reportCounter === counter) {
        console.log("All reports loaded in " + ( (Date.now() - startTime) / 1000) + " seconds");
    }
}