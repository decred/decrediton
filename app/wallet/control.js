import Promise from "promise";
import * as api from "middleware/walletrpc/api_pb";

const hexToBytes = (hex) => {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};

export const getNextAccount = (walletService, passphrase, name) =>
  new Promise((ok, fail) => {
    const request = new api.NextAccountRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setAccountName(name);
    walletService.nextAccount(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const getAccountExtendedKey = (walletService, accountNum) =>
  new Promise((ok, fail) => {
    const request = new api.GetAccountExtendedPubKeyRequest();
    request.setAccountNumber(accountNum);
    walletService.getAccountExtendedPubKey(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const renameAccount = (walletService, accountNum, newName) =>
  new Promise((ok, fail) => {
    const request = new api.RenameAccountRequest();
    request.setAccountNumber(accountNum);
    request.setNewName(newName);
    walletService.renameAccount(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const rescan = (walletService, beginHeight, cb) =>
  new Promise((ok, fail) => {
    const request = new api.RescanRequest();
    request.setBeginHeight(beginHeight);
    const scan = walletService.rescan(request);
    cb && scan.on("data", cb);
    scan.on("end", () => ok());
    scan.on("status", (status) => console.log("Rescan status:", status));
    scan.on("error", fail);
  });

export const importPrivateKey = (
  walletService,
  passphrase,
  accountNum,
  wif,
  rescan,
  scanFrom
) =>
  new Promise((ok, fail) => {
    const request = new api.ImportPrivateKeyRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setAccount(accountNum);
    request.setPrivateKeyWif(wif);
    request.setRescan(rescan);
    request.setScanFrom(scanFrom);
    walletService.importPrivateKey(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const importScript = (walletService, script) =>
  new Promise((ok, fail) => {
    const request = new api.ImportScriptRequest();
    request.setScript(new Uint8Array(Buffer.from(hexToBytes(script))));
    request.setRescan(false);
    request.setScanFrom(0);
    request.setRequireRedeemable(true);
    walletService.importScript(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const changePassphrase = (walletService, oldPass, newPass, priv) =>
  new Promise((ok, fail) => {
    const request = new api.ChangePassphraseRequest();
    request.setKey(
      api.ChangePassphraseRequest.Key[priv ? "PRIVATE" : "PUBLIC"]
    );
    request.setOldPassphrase(new Uint8Array(Buffer.from(oldPass)));
    request.setNewPassphrase(new Uint8Array(Buffer.from(newPass)));
    walletService.changePassphrase(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const signTransaction = (walletService, passphrase, rawTx) =>
  new Promise((ok, fail) => {
    const request = new api.SignTransactionRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setSerializedTransaction(new Uint8Array(Buffer.from(rawTx)));
    walletService.signTransaction(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const publishTransaction = (walletService, tx) =>
  new Promise((ok, fail) => {
    const request = new api.PublishTransactionRequest();
    request.setSignedTransaction(new Uint8Array(Buffer.from(tx)));
    walletService.publishTransaction(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const purchaseTickets = (
  walletService,
  passphrase,
  accountNum,
  spendLimit,
  requiredConf,
  numTickets,
  expiry,
  ticketFee,
  txFee,
  stakepool,
  signTx
) =>
  new Promise((ok, fail) => {
    const request = new api.PurchaseTicketsRequest();
    signTx && request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setAccount(accountNum);
    request.setSpendLimit(spendLimit);
    request.setRequiredConfirmations(requiredConf);
    request.setTicketAddress(stakepool.TicketAddress);
    request.setNumTickets(numTickets);
    request.setPoolAddress(stakepool.PoolAddress);
    request.setPoolFees(stakepool.PoolFees);
    request.setExpiry(expiry);
    request.setTxFee(txFee);
    request.setTicketFee(ticketFee);
    request.setDontSignTx(!signTx);
    walletService.purchaseTickets(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const revokeTickets = (walletService, passphrase) =>
  new Promise((ok, fail) => {
    const request = new api.RevokeTicketsRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    walletService.revokeTickets(request, (err, res) =>
      err ? fail(err) : ok(res)
    );
  });

export const constructTransaction = (
  walletService,
  accountNum,
  confirmations,
  outputs
) =>
  new Promise((ok, fail) => {
    const totalAmount = outputs.reduce((tot, { amount }) => tot + amount, 0);
    const request = new api.ConstructTransactionRequest();
    request.setSourceAccount(accountNum);
    request.setRequiredConfirmations(confirmations);
    request.setOutputSelectionAlgorithm(0);
    outputs.forEach(({ destination, amount }) => {
      const outputDest = new api.ConstructTransactionRequest.OutputDestination();
      const output = new api.ConstructTransactionRequest.Output();
      outputDest.setAddress(destination);
      output.setDestination(outputDest);
      output.setAmount(parseInt(amount));
      request.addNonChangeOutputs(output);
    });
    walletService.constructTransaction(request, (err, res) => {
      if (err) {
        fail(err);
        return;
      }
      res.totalAmount = totalAmount;
      ok(res);
    });
  });

export const constructSendAllTransaction = (
  walletService,
  accountNum,
  confirmations,
  outputs
) =>
  new Promise((ok, fail) => {
    const request = new api.ConstructTransactionRequest();
    const outputDest = new api.ConstructTransactionRequest.OutputDestination();
    if (outputs.length > 1)
      return fail("Too many outputs provided for a send all request.");
    if (outputs.length === 0)
      return fail("No destination specified for send all request.");
    outputDest.setAddress(outputs[0].destination);
    request.setSourceAccount(accountNum);
    request.setRequiredConfirmations(confirmations);
    request.setOutputSelectionAlgorithm(1);
    request.setChangeDestination(outputDest);
    walletService.constructTransaction(request, (err, res) =>
      err ? fail(err) : ok({ ...res, totalAmount: res.getTotalOutputAmount() })
    );
  });

export const getCoinjoinOutputspByAcct = (walletService) =>
  new Promise((ok, fail) => {
    const request = new api.GetCoinjoinOutputspByAcctRequest();
    walletService.getCoinjoinOutputspByAcct(request, (err, res) =>
      err ? fail(err) : ok({ ...res })
    );
  });
