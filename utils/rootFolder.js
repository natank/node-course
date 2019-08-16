const path = require('path');

let rootFolder = path.join(path.dirname(process.mainModule.filename))

module.exports = rootFolder;