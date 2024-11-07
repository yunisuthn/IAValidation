// scripts/postinstall.js
const path = require('path');
const ncp = require('ncp').ncp;

// Define source and destination paths
const source = path.join(__dirname, '../node_modules/@pdftron/pdfjs-express/public');
const destination = path.join(__dirname, '../public/pdfjs-express');

// Copy the files
ncp(source, destination, (err) => {
    if (err) {
        return console.error('Error copying PDF.js Express assets:', err);
    }
    console.log('PDF.js Express assets copied successfully!');
});
