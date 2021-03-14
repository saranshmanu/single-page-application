const UglifyJS = require('uglify-js');
const UglifyCSS = require('uglifycss');
const path = require('path');
const util = require('util');
const fs = require('fs');

const build = async () => {
  console.info('Building the project');
  const getFileName = (location, type) => {
    const file = location.split('/').pop();
    return file.split('.')[0] + '.min.' + type;
  };
  try {
    const readdir = util.promisify(fs.readdir);
    const writeFile = util.promisify(fs.writeFile);
    const readFile = util.promisify(fs.readFile);
    const mkdir = util.promisify(fs.mkdir);
    const jsFilesList = await readdir(path.join(__dirname, 'js'));
    const cssFilesList = await readdir(path.join(__dirname, 'css'));
    try {
      await mkdir(path.join(__dirname, '../public/js'));
    } catch (err) {}
    try {
      await mkdir(path.join(__dirname, '../public/css'));
    } catch (err) {}
    for (var index in jsFilesList) {
      const location = path.join(__dirname, 'js', jsFilesList[index]);
      const file = await readFile(location, 'utf8');
      const result = UglifyJS.minify(file);
      _ = await writeFile(path.join(__dirname, '../public/js', getFileName(location, 'js')), result.code);
    }
    var combinedCSS = '';
    for (var index in cssFilesList) {
      const location = path.join(__dirname, 'css', cssFilesList[index]);
      const file = await readFile(location, 'utf8');
      combinedCSS += UglifyCSS.processString(file);
    }
    _ = await writeFile(path.join(__dirname, '../public/css', 'style.min.css'), combinedCSS);
    console.info('Built complete');
  } catch (err) {
    console.error(err);
  }
};

module.exports = build;
