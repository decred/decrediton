var sys = require('sys');
var exec = require('child_process').exec;
var os = require('os');

if (os.type() === 'Linux' || os.type() === 'Darwin' ) 
   exec("rm -rf bin/site && cp -R ./node_modules/dcrdex-assets/dexc/site bin/");
else if (os.type() === 'Windows_NT') 
    exec("rd /s /q \"bin/site\" && Xcopy /E /I \"./node_modules/dcrdex-assets/dexc/site\" \"bin/site\"");
else
   throw new Error("Unsupported OS found: " + os.type());