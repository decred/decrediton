import Promise from "promise";
import * as api from "middleware/walletrpc/api_pb";

const hexToBytes = hex => {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};

export const getNextAccount = (walletService, passphrase, name) => new Promise((ok, fail) => {
  const request = new api.NextAccountRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccountName(name);
  walletService.nextAccount(request, (err, res) => err ? fail(err) : ok(res));
});

export const getAccountExtendedKey = (walletService, accountNum) => new Promise((ok, fail) => {
  const request = new api.GetAccountExtendedPubKeyRequest();
  request.setAccountNumber(accountNum);
  walletService.getAccountExtendedPubKey(request, (err, res) => err ? fail(err) : ok(res));
});

export const renameAccount = (walletService, accountNum, newName) => new Promise((ok, fail) => {
  const request = new api.RenameAccountRequest();
  request.setAccountNumber(accountNum);
  request.setNewName(newName);
  walletService.renameAccount(request, (err, res) => err ? fail(err) : ok(res));
});

export const rescan = (walletService, beginHeight, cb) => new Promise((ok, fail) => {
  const request = new api.RescanRequest();
  request.setBeginHeight(beginHeight);
  const scan = walletService.rescan(request);
  cb && scan.on("data", cb);
  scan.on("end", () => ok());
  scan.on("status", status => console.log("Rescan status:", status));
  scan.on("error", fail);
});

export const importPrivateKey = (walletService, passphrase, accountNum, wif, rescan, scanFrom) =>
  new Promise((ok, fail) => {
    const request = new api.ImportPrivateKeyRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setAccount(accountNum);
    request.setPrivateKeyWif(wif);
    request.setRescan(rescan);
    request.setScanFrom(scanFrom);
    walletService.importPrivateKey(request, (err, res) => err ? fail(err) : ok(res));
  });

export const importScript = (walletService, passphrase, script, rescan, scanFrom) =>
  new Promise((ok, fail) => {
    const request = new api.ImportScriptRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setScript(new Uint8Array(Buffer.from(hexToBytes(script))));
    request.setRescan(rescan);
    request.setScanFrom(scanFrom);
    request.setRequireRedeemable(true);
    walletService.importScript(request, (err, res) => err ? fail(err) : ok(res));
  });

export const changePassphrase = (walletService, oldPass, newPass, priv) =>
  new Promise((ok, fail) => {
    const request = new api.ChangePassphraseRequest();
    request.setKey(api.ChangePassphraseRequest.Key[priv ? "PRIVATE" : "PUBLIC"]);
    request.setOldPassphrase(new Uint8Array(Buffer.from(oldPass)));
    request.setNewPassphrase(new Uint8Array(Buffer.from(newPass)));
    walletService.changePassphrase(request, (err, res) => err ? fail(err) : ok(res));
  });

export const signTransaction = (walletService, passphrase, rawTx) => new Promise((ok, fail) => {
  const request = new api.SignTransactionRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setSerializedTransaction(new Uint8Array(Buffer.from(rawTx)));
  walletService.signTransaction(request, (err, res) => err ? fail(err) : ok(res));
});

export const publishTransaction = (walletService, tx) => new Promise((ok, fail) => {
  const request = new api.PublishTransactionRequest();
  request.setSignedTransaction(new Uint8Array(Buffer.from(tx)));
  walletService.publishTransaction(request, (err, res) => err ? fail(err) : ok(res));
});

export const purchaseTickets = (
  walletService, passphrase, accountNum, spendLimit, requiredConf, numTickets, expiry, ticketFee,
  txFee, stakepool
) => new Promise((ok, fail) => {
  const request = new api.PurchaseTicketsRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
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
  walletService.purchaseTickets(request, (err, res) => err ? fail(err) : ok(res));
});

export const revokeTickets = (walletService, passphrase) => new Promise((ok, fail) => {
  const request = new api.RevokeTicketsRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  walletService.revokeTickets(request, (err, res) => err ? fail(err) : ok(res));
});

export const setTicketBuyerAccount = (ticketBuyerService, account) => new Promise((ok, fail) => {
  const request = new api.SetAccountRequest();
  request.setAccount(account);
  ticketBuyerService.setAccount(request, (err, res) => err ? fail(err) : ok(res));
});

export const setTicketBuyerBalanceToMaintain = (ticketBuyerService, balanceToMaintain) =>
  new Promise((ok, fail) => {
    const request = new api.SetBalanceToMaintainRequest();
    request.setBalanceToMaintain(balanceToMaintain);
    ticketBuyerService.setBalanceToMaintain(request, (err, res) => err ? fail(err) : ok(res));
  });

export const setTicketBuyerMaxFee = (ticketBuyerService, maxFee) => new Promise((ok, fail) => {
  const request = new api.SetMaxFeeRequest();
  request.setMaxFeePerKb(maxFee);
  ticketBuyerService.setMaxFee(request, (err, res) => err ? fail(err) : ok(res));
});

export const setTicketBuyerMaxPriceAbsolute = (ticketBuyerService, maxPriceAbsolute) =>
  new Promise((ok, fail) => {
    const request = new api.SetMaxPriceAbsoluteRequest();
    request.setMaxPriceAbsolute(maxPriceAbsolute);
    ticketBuyerService.setMaxPriceAbsolute(request, (err, res) => err ? fail(err) : ok(res));
  });

export const setTicketBuyerMaxPriceRelative = (ticketBuyerService, maxPriceRelative) =>
  new Promise((ok, fail) => {
    const request = new api.SetMaxPriceRelativeRequest();
    request.setMaxPriceRelative(maxPriceRelative);
    ticketBuyerService.setMaxPriceRelative(request, (err, res) => err ? fail(err) : ok(res));
  });

export const setTicketBuyerVotingAddress = (ticketBuyerService, address) =>
  new Promise((ok, fail) => {
    const request = new api.SetVotingAddressRequest();
    request.setVotingAddress(address);
    ticketBuyerService.setVotingAddress(request, (err, res) => err ? fail(err) : ok(res));
  });

export const setTicketBuyerPoolAddress = (ticketBuyerService, address) =>
  new Promise((ok, fail) => {
    const request = new api.SetPoolAddressRequest();
    request.setPoolAddress(address);
    ticketBuyerService.setPoolAddress(request, (err, res) => err ? fail(err) : ok(res));
  });

export const setTicketBuyerPoolFees = (ticketBuyerService, poolFees) => new Promise((ok, fail) => {
  const request = new api.SetPoolFeesRequest();
  request.setPoolFees(poolFees);
  ticketBuyerService.setPoolFees(request, (err, res) => err ? fail(err) : ok(res));
});

export const setTicketBuyerMaxPerBlock = (ticketBuyerService, max) =>new Promise((ok, fail) => {
  const request = new api.SetMaxPerBlockRequest();
  request.setMaxPerBlock(max);
  ticketBuyerService.setMaxPerBlock(request, (err, res) => err ? fail(err) : ok(res));
});

export const startAutoBuyer = (
  ticketBuyerService, passphrase, accountNum, balanceToMaintain, maxFeePerKb, maxPriceRelative,
  maxPriceAbsolute, maxPerBlock, stakepool
) => new Promise((ok, fail) => {
  const request = new api.StartAutoBuyerRequest();
  request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
  request.setAccount(accountNum);
  request.setBalanceToMaintain(balanceToMaintain);
  request.setMaxFeePerKb(maxFeePerKb);
  request.setMaxPriceRelative(maxPriceRelative);
  request.setMaxPriceAbsolute(maxPriceAbsolute);
  request.setVotingAddress(stakepool.TicketAddress);
  request.setPoolAddress(stakepool.PoolAddress);
  request.setPoolFees(stakepool.PoolFees);
  request.setMaxPerBlock(maxPerBlock);
  ticketBuyerService.startAutoBuyer(request, (err, res) => err ? fail(err) : ok(res));
});

export const constructTransaction = (walletService, accountNum, confirmations, outputs) =>
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
    walletService.constructTransaction(request, (err, res) =>
      err ? fail(err) : ok({ ...res, totalAmount }));
  });

export const constructSendAllTransaction = (walletService, accountNum, confirmations, outputs) =>
  new Promise((ok, fail) => {
    const request = new api.ConstructTransactionRequest();
    const outputDest = new api.ConstructTransactionRequest.OutputDestination();
    if (outputs.length > 1) return fail("Too many outputs provided for a send all request.");
    if (outputs.length === 0) return fail("No destination specified for send all request.");
    outputDest.setAddress(outputs[0].destination);
    request.setSourceAccount(accountNum);
    request.setRequiredConfirmations(confirmations);
    request.setOutputSelectionAlgorithm(1);
    request.setChangeDestination(outputDest);
    walletService.constructTransaction(request, (err, res) =>
      err ? fail(err) : ok({ ...res, totalAmount: res.getTotalOutputAmount() }));
  });
