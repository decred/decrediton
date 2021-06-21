/******************************************************************************
 * Script to generate the dependency graph for the various layers of the
 * application.
 *
 * For each (electron,preload,ui) layer, this generates:
 *
 *    - A sorted json file with individual file dependencies in the app;
 *    - A corresponding svg visualization of the dependencies;
 *    - A list of top-level dependencies of that layer;
 *    - A link to npmgraph.js.org to see the corresponding dependency graph.
 *
 * This script is useful to keep track of dependencies on each layer, in
 * particular of the main (i.e. electron) layer and the preload layer which
 * should have as few dependencies as possible.
 ******************************************************************************/
const path = require("path");
const outputDir = path.resolve("./deps-graphs");
const fs = require("fs");
const madge = require("madge");
const stringify = require("json-stable-stringify");
const packageJson = require(path.resolve("package.json"));
const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

// The main electron and preload layers implicitly require electron, so
// ignore those as dependencies since it clears up the graphs a bit.
const ignoreImportsElectron = ["electron", "electron-devtools-installer"];
const ignoreImportsPreload = ["electron"];
const ignoreImportsUI = [];

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

async function genDepGraph(layer, entryPointRel, ignoreImports) {
  const webpackCfg = `webpack/${layer}.prod.js`;
  const entryPoint = path.resolve(entryPointRel);
  const outImg = path.resolve(path.join(outputDir, `${layer}.svg`));
  const outJson = path.resolve(path.join(outputDir, `${layer}.json`));
  const madgeCfg = { includeNpm: true, webpackCfg };

  if (layer == "ui") {
    madgeCfg.excludeRegExp = [/\.css$/, /\.ttf$/, /\.json$/, /\.svg$/, /\.gif$/,
      /\.png$/];
  }

  const processed = await madge(entryPoint, madgeCfg);
  await processed.image(outImg);
  const processedObj = processed.obj();
  fs.writeFileSync(outJson, stringify(processedObj, { space: "\t" }));

  // Figure out all individual imports from node_modules.
  const nodeModulesImports = {};
  Object.keys(processedObj).forEach((key) => {
    processedObj[key].forEach(importName => {
      const matches = importName.match(/node_modules\/([^/]*)\/.*$/);
      if (!matches) return;
      const moduleName = matches[1];
      if (ignoreImports.indexOf(moduleName) > -1) return;
      nodeModulesImports[moduleName] = allDeps[moduleName] ? `@${allDeps[moduleName]}` : "";
    });
  });

  // Print a comma-separated list of top-level npm modules imported by this layer.
  const importModules = Object.entries(nodeModulesImports).map(v => v[0]+v[1]);
  const importNames = importModules.sort().join(",");
  console.log(`Top-level node modules for ${layer}:`,  importNames);
  console.log("https://npmgraph.js.org/?q=" + encodeURIComponent(importNames));
}

async function main() {
  await genDepGraph("electron", "./app/main.development.js", ignoreImportsElectron);
  console.log("\n");
  await genDepGraph("preload", "./app/wallet-preload.js", ignoreImportsPreload);
  console.log("\n");
  await genDepGraph("ui", "./app/index.js", ignoreImportsUI);
}

main().then().catch(err => console.error(err));
