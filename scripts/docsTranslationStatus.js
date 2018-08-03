// Show translation status for docs of a given language.
// Use this as:
//
// $ yarn i18n-check-docs [lang]
//
// Where [lang] is a language subdir in the docs root (app/i18n/docs).

var glob = require("glob");
var chalk = require("chalk");

if (process.argv.length < 3) {
  console.log(chalk.red("Specify the language subdir argument (in app/i18n/docs)"));
  process.exit(1);
}

const lang = process.argv[2];
const opts = {};
const srcPath = "app/i18n/docs/en";
const langPath = `app/i18n/docs/${lang}`;

let sourceDocs = glob.sync(`${srcPath}/**/*.md`, opts);
let langDocs = glob.sync(`${langPath}/**/*.md`, opts);

let hasMissing = false;
for (let src of sourceDocs) {
  let doc = src.substr(srcPath.length);
  let idx = langDocs.indexOf(`${langPath}${doc}`);
  if (idx === -1) {
    console.log(chalk.red(`Missing ${langPath}${doc}`));
    hasMissing = true;
  }
}

if (!hasMissing) {
  console.log(chalk.green(`All docs are translated for language '${lang}'`));
} else {
  process.exit(1);
}
