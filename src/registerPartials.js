const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const { partialsPath } = require('./constants');

module.exports = () => {
  const partialFiles = fs.readdirSync(partialsPath);
  partialFiles.forEach((filename) => Handlebars.registerPartial(
    path.basename(filename).split('.')[0],
    fs.readFileSync(path.join(partialsPath, filename), 'utf-8'),
  ));
};
