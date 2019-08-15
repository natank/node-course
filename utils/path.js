const path = require('path');

let main = process.mainModule;

module.exports = path.dirname(main.filename);