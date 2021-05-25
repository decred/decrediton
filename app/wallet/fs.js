import fs from "fs";
import path from "path";
import { makeRandomString } from "helpers/strings";
import { ipcRenderer } from "electron";

// This map decouples an fd (number) from an opaque identifier, so that the UI
// can only write to files previously opened through these functions.
const fds = {};

export const openWritable = (filename) => {
  if (fs.existsSync(filename)) {
    const confirmOverwrite = ipcRenderer.sendSync(
      "confirm-file-overwrite",
      filename
    );
    if (!confirmOverwrite) throw new Error("User canceled file overwrite");
  }

  const fd = fs.openSync(filename, "w", 0o600);
  const id = makeRandomString(32);
  fds[id] = fd;
  return id;
};

export const writeSync = (id, s) => {
  const fd = fds[id];
  if (!fd) {
    throw new Error(`id ${id} not a previously opened file`);
  }

  return fs.writeSync(fd, s);
};

export const closeSync = (id) => {
  const fd = fds[id];
  if (!fd) {
    throw new Error(`id ${id} not a previously opened file`);
  }

  delete fds[id];
  return fs.closeSync(fd);
};

export const readFileSync = fs.readFileSync;

export const joinPaths = path.join;
