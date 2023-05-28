const filterCsvFile = require('../index');
const fs = require('fs');

const csvFilePath = './test/data/test.csv';
const configFilePath = './column_config.txt';
const expectedOutputFilePath = './test/data/expected_output.csv';

describe('filterCsvFile', () => {
  it('should filter the CSV file correctly', (done) => {
    filterCsvFile(csvFilePath, configFilePath);

    // Check if the filtered CSV file matches the expected output
    const filteredCsvData = fs.readFileSync(expectedOutputFilePath, 'utf8');
    const newCsvFilePath = csvFilePath.replace('.csv', '_FIX.csv');
    const newCsvData = fs.readFileSync(newCsvFilePath, 'utf8');

    expect(newCsvData).toEqual(filteredCsvData);

    // Clean up the generated file
    fs.unlinkSync(newCsvFilePath);

    done();
  });
});