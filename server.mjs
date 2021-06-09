/* eslint-disable no-console */
/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 * @flow
 */

import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { spawn } from "child_process";
import fs from "fs";
import minimist from "minimist";

import config from "./webpack/ui.dev.js";

const argv = minimist(process.argv.slice(2));

const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;

const wdm = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

app.use(wdm);

app.use(webpackHotMiddleware(compiler));

let preloadProc;
const sleep = (ms) => new Promise(ok => setTimeout(ok, ms));

const server = app.listen(PORT, "localhost", async serverError => {
  if (serverError) {
    return console.error(serverError);
  }

  // Start a webpack run to watch for changes to the preload script. We wait
  // until the preload script is compiled to proceed with the server init.
  const preloadPath = "./app/dist/wallet-preload.js";
  if (fs.existsSync(preloadPath)) fs.unlinkSync(preloadPath);
  preloadProc = spawn("npm", ["run", "start-preload"], { shell: true, env: process.env, stdio: "inherit" });
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    if (fs.existsSync(preloadPath)) break;
  }
  if (!fs.existsSync(preloadPath)) {
    throw "Preload script not created at " + preloadPath;
  }


  if (argv["start-hot"]) {
    spawn("npm", [ "run", "start-hot" ], { shell: true, env: process.env, stdio: "inherit" })
      .on("close", code => process.exit(code))
      .on("error", spawnError => console.error(spawnError));
  } else if (argv["start-hot-nosandbox"]) {
    spawn("npm", [ "run", "start-hot-nosandbox" ], { shell: true, env: process.env, stdio: "inherit" })
      .on("close", code => process.exit(code))
      .on("error", spawnError => console.error(spawnError));
  }

  console.log(`Listening at http://localhost:${PORT}`);
});

process.on("exit", () => {
  preloadProc && preloadProc.kill();
});

process.on("SIGTERM", () => {
  console.log("Stopping dev server");
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});
