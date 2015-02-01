/*
	beer color data
 */

'use strict';

var fs = require('fs');
var path = require('path');
var EventEmitter = require("events").EventEmitter;

var xml2js = require('xml2js');
var _ = require('lodash');
var onecolor = require('onecolor');

var dataSrc = './src/colors.xml';
var dataDest = './src/colors.json';
var dataOutput = '';

// Read the file.
var parser = new xml2js.Parser();

fs.readFile(path.join(__dirname, dataSrc), function(err, data) {

    if (err) {
        console.log(err);
        return;
    }

    parser.parseString(data, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            writeEvent.emit('write', result);
        }
    });

});


// Write the file.
var writeEvent = new EventEmitter();

writeEvent.on("write", function(data) {

    var colors = data.COLORS.COLOR;
    var parsed = _.map(colors, parseColors);

    // Write the new file.
    fs.writeFile(path.join(__dirname, dataDest), JSON.stringify(parsed), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });

});


function parseColors(data) {

    var color = onecolor('rgb(' + data.RGB + ')');

    return {
        'srm': parseFloat(data.SRM, 10),
        'hex': color.hex(),
        'css': color.css()
    };

}
