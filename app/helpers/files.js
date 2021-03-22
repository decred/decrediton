import fs from "fs-extra";
import path from "path";

// readFileBackward reads a file backward and if maxSize is specified it will
// only read until reach that size in bytes.
export function readFileBackward(path, maxSize, end) {
  fs.open(path, "r", function (error, descriptor) {
    if (error) return end(error);
    fs.fstat(descriptor, function (error, stats) {
      if (error) return end(error);
      let buffer, position;
      if (stats.size > maxSize) {
        buffer = Buffer.alloc(maxSize);
        position = stats.size - maxSize;
      } else {
        buffer = Buffer.alloc(stats.size);
        position = 0;
      }
      let offset = 0;
      let length = buffer.length;
      const read = function () {
        fs.read(descriptor, buffer, offset, length, position, function (
          error,
          copied
        ) {
          if (error) return end(error);
          offset += copied;
          length -= copied;
          if (length === 0) return end(undefined, buffer);
          read();
        });
      };
      read();
    });
  });
}

// makeFileBackup makes a backup of the file on the directory specified.
// If the directory does not exists, it will be created.
export function makeFileBackup(file, directory) {
  if (!fs.existsSync(file)) {
    throw "File does not exists";
  }
  // get file name so we can use it to make the backup.
  const fileName = path.basename(file);
  // if directory does not exists, create it.
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  // copy it to directory specified
  fs.copyFileSync(file, `${directory}/${fileName}`, (err) => {
    if (err) {
      throw err;
    }
  });

  return true;
}
