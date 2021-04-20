const { getNativeFunction, getBufferPointer } = require("sbffi");

const libPath = "libdexc/libdexc.so";
const call = getNativeFunction(libPath, "CallAlt", "uint8_t",
  ["char *", "char *", "uint32_t", "char *"]);

console.log("Initialized lib. Gonna call.");

const arg = '{"function":"__ping", "params": ["boo!"]}';
const argBuffer = Buffer.from(arg);
const argPointer = getBufferPointer(argBuffer);

const resBufferSz = 80;
const resBuffer = Buffer.alloc(resBufferSz);
const resPointer = getBufferPointer(resBuffer);

const writtenSzBuffer = Buffer.alloc(8);
const writtenSzPointer = getBufferPointer(writtenSzBuffer);

const ret = call(argPointer, resPointer, resBufferSz, writtenSzPointer);
const writtenSz = writtenSzBuffer.readUIntLE(0, 4);

console.log("Called. gonna show response.");
console.log("Return value:", ret, "Buffer written size:", writtenSz);
console.log("Raw response buffer:", resBuffer);

const resNonZero = resBuffer.slice(0, writtenSz);
const resStr = resNonZero.toString().trim();
console.log("Response string:", resStr);
