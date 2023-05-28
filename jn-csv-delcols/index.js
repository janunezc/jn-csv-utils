#!/usr/bin/env node

const filterCsvFile = require('./library');
const fs = require('fs');

const csvFilePath = process.argv[2];
const configFilePath = './column_config.txt';

filterCsvFile(csvFilePath, configFilePath);