var Firebase = require('firebase');
var Fs       = require('fs');
var _        = require('lodash');

var argv = require('yargs')
    .usage('\nUsage: $0 -fbUrl [string] -file [string]')
    .demand(['fbUrl', 'file'])
    .argv;

var fbUrl = argv.fbUrl;
var file = argv.file;

var fb = new Firebase(fbUrl);
var weather = JSON.parse(Fs.readFileSync(file, 'utf8'));

var startTime = Date.now();

var counter = 0;
var reportCounter = 0;

_.forEach(weather, function(report) {

    try{
        var station = report.StationNumber.replace(' ','');

        var date = new Date(report.ObservationDate);
        var year = date.getFullYear();
        var month = date.getMonth() + 1

        var info = {
            "date"              : report.ObservationDate,
            "totalPrecipAmt"    : formatPrecip(report.TotalPrecipAmt),
            "newSnowDepth"      : formatPrecip(report.NewSnowDepth),
            "newSnowSWE"        : formatPrecip(report.NewSnowSWE),
            "totalSnowDepth"    : formatPrecip(report.TotalSnowDepth),
            "totalSnowSWE"      : formatPrecip(report.TotalSnowSWE)
        };

        fb.child('weather-by-month').child('tx').child(station).child('reports').child(year).child(month).push(info, function(err) {
            if(err) console.log(err);
            counter++;
            if(counter%1000 === 0 ) console.log(counter + " records in " + ( (Date.now() - startTime) / 1000) + " seconds");
            reportCompleted();
        });

    } catch(e) {

        console.log('Bad record');
        console.log(report);
    }

});

console.log("All reports processed in " + ( (Date.now() - startTime) / 1000) + " seconds");

function reportCompleted() {

    if(counter%1000 === 0 ) console.log(counter + " records uploaded in " + ( (Date.now() - startTime) / 1000) + " seconds");

    if(reportCounter === counter) {
        console.log("All reports loaded in " + ( (Date.now() - startTime) / 1000) + " seconds");
    }
}

function formatPrecip(data) {

    data = data.toLowerCase();
    if(data.indexOf('t') !== -1 ) return data.replace(' ','');
    if(data.indexOf('na') !== -1 ) return data.replace(' ','');
    return parseFloat(data);

}

// DO NOT EXIT!!
//process.exit();