var fs = require('fs');
var path = require('path');
var generate = require('csv-generate');
var argv = require('minimist')(process.argv.slice(2));

var hrstart = process.hrtime();

var file = 'my.csv';
var rows = typeof argv.rows !== 'undefined' ? argv.rows : 1;  //1MILLION ROWS

var writer = fs.createWriteStream(path.normalize(file));

generate.Generator.ascii3 = function(gen) {
    return '"'+generate.Generator.ascii(gen).substring(0, 3)+'"';
};

generate.Generator.ascii8 = function(gen) {
    return '"'+generate.Generator.ascii(gen).substring(0, 8)+'"';
};

generate.Generator.ascii16 = function(gen) {
    return '"'+generate.Generator.ascii(gen).substring(0, 16)+'"';
};

generate.Generator.smallint = function(gen) {
    return Math.floor(gen.random() * Math.pow(2, 10));
};

//generate({length: 10000}).pipe(process.stdout);
//generate({length: 10000000}).pipe(writer);

generate({
columns: ['ascii3', 'ascii8', 'ascii16', 'ascii16', 'smallint', 'smallint'],
length: rows
}).pipe(writer);

writer.on('close', (chunk) => {

    hrend = process.hrtime(hrstart)

    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

});