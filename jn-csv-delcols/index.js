#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const json2csv = require('json2csv').parse;

console.log = function(){};

const allowedColumns = fs.readFileSync('column_config.txt', 'utf8').split(',');

function filterCsvFile(csvFilePath, configFilePath) {
  const data = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const filteredRow = {};
      allowedColumns.forEach((col) => {
        if (row[col] !== undefined) {
          filteredRow[col] = row[col];
        }
      });
      data.push(filteredRow);
    })
    .on('end', () => {

      console.log('CSV file successfully processed');

      const newFilePath = path.join(path.dirname(csvFilePath), path.basename(csvFilePath, '.csv') + '_FIX.csv');
      const csv = json2csv(data, { fields: allowedColumns });
      fs.writeFileSync(newFilePath, csv);

      console.log('Filtered CSV file has been written: ', newFilePath);
    });

}

module.exports = filterCsvFile;
