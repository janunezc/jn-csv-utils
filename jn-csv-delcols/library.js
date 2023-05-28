const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const json2csv = require('json2csv').parse;

console.log = function (){};
console.log("-------------------------------")
console.log("Thanks for using jn-csv-delcols");

const allowedColumns = fs.readFileSync('column_config.txt', 'utf8').split(',');
console.log("Allowed Columns", allowedColumns);

function filterCsvFile(csvFilePath) {
  console.log("Processing file:", csvFilePath);
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
