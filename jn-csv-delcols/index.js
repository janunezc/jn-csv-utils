const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function filterCsvFile(csvFilePath, configFilePath) {
  const columnConfig = fs.readFileSync(configFilePath, 'utf8').trim();
  const predefinedColumns = columnConfig.split(',');

  const rows = [];
  const header = [];
  let filteredRows = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('headers', (headers) => {
      header.push(...headers);
    })
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', () => {
      const indicesToRemove = header
        .map((column, index) => (predefinedColumns.includes(column) ? -1 : index))
        .filter((index) => index >= 0)
        .reverse();

      filteredRows = rows.map((row) => {
        indicesToRemove.forEach((index) => {
          delete row[index];
        });
        return row;
      });

      const newCsvFilePath = path.join(path.dirname(csvFilePath), `${path.basename(csvFilePath, '.csv')}_FIX.csv`);

      const csvStream = fs.createWriteStream(newCsvFilePath);
      csvStream.write(header.join(',') + '\n');
      filteredRows.forEach((row) => {
        csvStream.write(Object.values(row).join(',') + '\n');
      });

      csvStream.end();

      console.log(`Filtered CSV file saved as ${newCsvFilePath}`);
    });
}

module.exports = filterCsvFile;
