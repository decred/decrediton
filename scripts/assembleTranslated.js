const fs = require("fs");
const path = require("path");
const root = path.join("app", "i18n", "po");

// Rename transifex downloaded files to pattern expected by react-intl-po
fs.readdirSync(root).forEach(fname => {
  const matches = fname.match(/(.*)_(.*)\.po/);
  if (!matches) return;
  const destFname = path.join(root, matches[1] + "." + matches[2] + ".po");
  if (fs.existsSync(destFname)) {
    fs.unlinkSync(destFname);
  }
  fs.renameSync(path.join(root, fname), destFname);
});
