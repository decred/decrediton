var fs = require("fs");
var path = require("path");
var root = path.join("app", "i18n", "po");

// Rename transifex downloaded files to pattern expected by react-intl-po
fs.readdirSync(root).forEach(fname => {
  let matches = fname.match(/(.*)_(.*)\.po/);
  if (!matches) return;
  let destFname = path.join(root, matches[1] + "." + matches[2] + ".po");
  if (fs.existsSync(destFname)) {
    fs.unlinkSync(destFname);
  }
  fs.renameSync(path.join(root, fname), destFname);
});
