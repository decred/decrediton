// getLogFile attempts to read the logfile at the given path
export function getLogFile(logPath) {
  var reader = new FileReader();
  reader.onload = function(event) {
    var contents = event.target.result;
    console.log("File contents: " + contents);
  };

  reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsText(logPath);
  return logPath;
}
