
let ipcRenderer = require("electron").ipcRenderer;
ipcRenderer.on("exes-versions", function (event, versions) {
  document.getElementById("decreditonVersion").innerHTML = versions["decrediton"];
  document.getElementById("dcrdVersion").innerHTML = versions["dcrd"];
  document.getElementById("dcrwalletVersion").innerHTML = versions["dcrwallet"];
  document.getElementById("walletGrpcVersion").innerHTML = versions["grpc"]["walletVersion"];
  document.getElementById("requiredWalletGrpcVersion").innerHTML = versions["grpc"]["requiredVersion"];
  document.getElementById("whatsNewLink").href =
    `https://github.com/decred/decred-binaries/releases/tag/v${versions["decrediton"]}`;
});
