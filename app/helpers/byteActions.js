import fs from "fs-extra";

// @flow
export function reverseHash(s) {
  s = s.replace(/^(.(..)*)$/, "0$1"); // add a leading zero if needed
  var a = s.match(/../g);             // split number in groups of two
  a.reverse();                        // reverse the groups
  var s2 = a.join("");
  return s2;
}

// reverseRawHash reverses a hash encoded as Uint8Array (instead of as string)
export function reverseRawHash(arr) {
  return reverseHash(Buffer.from(arr).toString("hex"));
}

// strHashToRaw converts a (reversed) string hash into an Uint8Array.
export function strHashToRaw(hash) {
  return new Uint8Array(Buffer.from(hash, "hex").reverse());
}

// Convert hash encoded as raw bytes into an hex (reversed) string hash.
export function rawHashToHex(raw) {
  return reverseHash(Buffer.from(raw).toString("hex"));
}

// Convert raw bytes (from grpc endpoint) to hex
export function rawToHex(bin) {
  return Buffer.from(bin).toString("hex");
}

export function hexToRaw(hex) {
  return new Uint8Array(Buffer.from(hex, "hex"));
}

// hexReversedHashToArray converts a (reversed, hex-encoded) hash string into
// an Uint8Array, suitable for sending into grpc calls.
export function hexReversedHashToArray(hexStr) {
  const res = new Uint8Array(Buffer.from(hexStr, "hex"));
  res.reverse();
  return res;
}

// readFileBackward reads a file backward and if maxSize is specified it will
// only read until reach that size in bytes.
export function readFileBackward(path, maxSize, end) {
  fs.open(path, "r",
    function(error, descriptor) {
      if (error) return end(error);
      fs.fstat(descriptor,
        function(error, stats) {
          if (error) return end(error);
          let buffer, position;
          if(stats.size > maxSize) {
            buffer = Buffer.alloc(maxSize);
            position = stats.size - maxSize;
          } else {
            buffer = Buffer.alloc(stats.size);
            position = 0;
          }
          let offset = 0;
          let length = buffer.length;
          const read = function() {
            fs.read(descriptor, buffer, offset, length, position,
              function(error, copied) {
                if (error) return end(error);
                offset += copied;
                length -= copied;
                if (length === 0) return end(undefined, buffer);
                read();
              }
            );
          };
          read();
        }
      );
    }
  );
}

// str2utf8hex converts a (js, utf-16) string into (utf-8 encoded) hex.
export function str2utf8hex(str) {
  return Buffer.from(str).toString("hex");
}

export function hex2b64(hex) {
  return new Buffer(hex, "hex").toString("base64");
}
