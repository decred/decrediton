import { walletrpc as api } from "middleware/walletrpc/api_pb";
import {
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_CONFIRMED
} from "constants";
import { rawHashToHex, rawToHex, strHashToRaw } from "../helpers/byteActions";
import { shimStreamedResponse } from "helpers/electronRenderer";
import { getClient } from "middleware/grpc/clientTracking";
import { signTx as confDialogSignTx } from "./confirmationDialog";
import { validateAddress } from "./service";

export const getNextAccount = (walletService, passphrase, name) =>
  new Promise((ok, fail) => {
    const request = new api.NextAccountRequest();
    request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    request.setAccountName(name);
    getClient(walletService).nextAccount(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const getAccountExtendedKey = (walletService, accountNum) =>
  new Promise((ok, fail) => {
    const request = new api.GetAccountExtendedPubKeyRequest();
    request.setAccountNumber(accountNum);
    getClient(walletService).getAccountExtendedPubKey(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const renameAccount = (walletService, accountNum, newName) =>
  new Promise((ok, fail) => {
    const request = new api.RenameAccountRequest();
    request.setAccountNumber(accountNum);
    request.setNewName(newName);
    getClient(walletService).renameAccount(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const rescan = (walletService, beginHeight, beginHash) => {
  const request = new api.RescanRequest();
  if (beginHeight !== null) {
    request.setBeginHeight(beginHeight);
  } else {
    request.setBeginHash(new Uint8Array(Buffer.from(beginHash)));
  }
  return shimStreamedResponse(getClient(walletService).rescan(request));
};

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
    getClient(walletService).importPrivateKey(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
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
    getClient(walletService).changePassphrase(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

const decodeTxInWallet = (decodeMsgService, rawTx) =>
  new Promise((ok, fail) => {
    const req = new api.DecodeRawTransactionRequest();
    req.setSerializedTransaction(rawTx);
    getClient(decodeMsgService).decodeRawTransaction(req, (err, res) =>
      err ? fail(err) : ok(res.toObject().transaction)
    );
  });

export const signTransaction = async (
  walletService,
  decodeMsgService,
  rawTxHex
) => {
  // Decode the transaction via the wallet to find out the address.
  const rawTx = new Uint8Array(Buffer.from(rawTxHex, "hex"));
  const tx = await decodeTxInWallet(decodeMsgService, rawTx);

  // Sum the total output amount and identify which outputs are not standard
  // wallet addresses.
  let totalOutAmount = 0;
  let fee = tx.inputsList.reduce((acc, v) => acc + v.amountIn, 0);
  const outputs = [];
  for (const out of tx.outputsList) {
    const newOutput = {
      address: "[unrecognized script]",
      amount: out.value
    };
    fee -= out.value;

    if (out.addressesList.length > 1) {
      // Multiple addresses means it's a multisig. So show all.
      newOutput.address = out.addressesList.join(", ");
    } else if (out.addressesList.length == 1) {
      // A single address. Check whether it's a standard BIP0044 address from the
      // wallet and ignore if it is (means this is a change address or an in-wallet
      // transfer).
      newOutput.address = out.addressesList[0];
      const addrResp = await validateAddress(
        walletService,
        out.addressesList[0]
      );
      const importedAccountsStart = 2 ** 31 - 1;
      if (
        addrResp.isValid &&
        addrResp.isMine &&
        addrResp.accountNumber < importedAccountsStart
      ) {
        // Non-imported address from the wallet. Don't need to show it.
        continue;
      }
    }

    outputs.push(newOutput);
    totalOutAmount += out.value;
  }
  totalOutAmount += fee;

  // Ask for final confirmation via out-of-process dialog.\
  await confDialogSignTx(totalOutAmount, outputs);

  const request = new api.SignTransactionRequest();
  request.setSerializedTransaction(rawTx);
  return await new Promise((ok, fail) =>
    getClient(walletService).signTransaction(request, (err, res) =>
      err
        ? fail(err)
        : ok({
            transaction: rawToHex(res.getTransaction()),
            unsignedInputIndexes: res.getUnsignedInputIndexesList()
          })
    )
  );
};

export const publishTransaction = (walletService, tx) =>
  new Promise((ok, fail) => {
    const request = new api.PublishTransactionRequest();
    request.setSignedTransaction(new Uint8Array(Buffer.from(tx, "hex")));
    getClient(walletService).publishTransaction(request, (err, res) => {
      if (err) return fail(err);
      const resObj = res.toObject();
      resObj.transactionHash = rawHashToHex(res.getTransactionHash());
      ok(resObj);
    });
  });

export const purchaseTickets = (
  walletService,
  accountNum,
  numTickets,
  signTx,
  vsp,
  csppReq
) =>
  new Promise((resolve, reject) => {
    const request = new api.PurchaseTicketsRequest();
    const {
      mixedAccount,
      changeAccount,
      csppServer,
      csppPort,
      mixedAcctBranch
    } = csppReq;
    // if mixed or change account is defined it is a privacy request.
    if (mixedAccount || changeAccount) {
      // check if any cspp argument is missing.
      // mixed acct branch can be 0.
      if (
        !mixedAccount ||
        !changeAccount ||
        !csppServer ||
        !csppPort ||
        (!mixedAcctBranch && mixedAcctBranch !== 0)
      ) {
        throw "missing cspp argument";
      }
      request.setMixedAccount(mixedAccount);
      request.setMixedSplitAccount(mixedAccount);
      request.setChangeAccount(changeAccount);
      request.setCsppServer(csppServer + ":" + csppPort);
      request.setMixedAccountBranch(mixedAcctBranch);
    } else {
      request.setChangeAccount(accountNum.value);
    }
    request.setAccount(accountNum.value);
    request.setNumTickets(numTickets);
    request.setDontSignTx(!signTx);
    const { pubkey, host } = vsp;
    request.setVspPubkey(pubkey);
    request.setVspHost("https://" + host);
    getClient(walletService).purchaseTickets(request, (error, response) => {
      if (error) {
        return reject(error);
      }
      const resObj = response.toObject();
      resObj.ticketHashes = response
        .getTicketHashesList()
        .map((v) => rawHashToHex(v));
      resolve(resObj);
    });
  });

export const revokeTickets = (walletService) =>
  new Promise((ok, fail) => {
    const request = new api.RevokeTicketsRequest();
    getClient(walletService).revokeTickets(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const revokeTicket = (walletService, ticketHash) =>
  new Promise((ok, fail) => {
    const request = new api.RevokeTicketRequest();
    request.setTicketHash(strHashToRaw(ticketHash));
    getClient(walletService).revokeTicket(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const constructTransaction = (
  walletService,
  accountNum,
  confirmations,
  outputs,
  change
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

    if (change?.script) {
      const changeDest = new api.ConstructTransactionRequest.OutputDestination();
      changeDest.setScript(Buffer.from(change.script));
      request.setChangeDestination(changeDest);
    } else if (change?.address) {
      const outputDest = new api.ConstructTransactionRequest.OutputDestination();
      outputDest.setAddress(change.address);
      request.setChangeDestination(outputDest);
    }

    getClient(walletService).constructTransaction(request, (err, res) => {
      if (err) {
        fail(err);
        return;
      }
      const resObj = res.toObject();
      resObj.totalAmount = totalAmount;
      resObj.unsignedTransaction = rawToHex(res.getUnsignedTransaction());
      ok(resObj);
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
    outputDest.setAddress(outputs[0].data.destination);
    request.setSourceAccount(accountNum);
    request.setRequiredConfirmations(confirmations);
    request.setOutputSelectionAlgorithm(1);
    request.setChangeDestination(outputDest);
    getClient(walletService).constructTransaction(request, (err, res) => {
      if (err) {
        fail(err);
        return;
      }
      const resObj = res.toObject();
      resObj.totalAmount = res.getTotalOutputAmount();
      resObj.unsignedTransaction = rawToHex(res.getUnsignedTransaction());
      ok(resObj);
    });
  });

export const getCoinjoinOutputspByAcctReq = (walletService) =>
  new Promise((ok, fail) => {
    const request = new api.GetCoinjoinOutputspByAcctRequest();
    getClient(walletService).getCoinjoinOutputspByAcct(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

// Map from numerical into defined fee status type
const FeeStatus = {
  [VSP_FEE_PROCESS_STARTED]:
    api.GetVSPTicketsByFeeStatusRequest.FeeStatus.VSP_FEE_PROCESS_STARTED,
  [VSP_FEE_PROCESS_PAID]:
    api.GetVSPTicketsByFeeStatusRequest.FeeStatus.VSP_FEE_PROCESS_PAID,
  [VSP_FEE_PROCESS_ERRORED]:
    api.GetVSPTicketsByFeeStatusRequest.FeeStatus.VSP_FEE_PROCESS_ERRORED,
  [VSP_FEE_PROCESS_CONFIRMED]:
    api.GetVSPTicketsByFeeStatusRequest.FeeStatus.VSP_FEE_PROCESS_CONFIRMED
};

export const getVSPTicketsByFeeStatus = (walletService, feeStatus) =>
  new Promise((resolve, reject) => {
    const request = new api.GetVSPTicketsByFeeStatusRequest();
    request.setFeeStatus(FeeStatus[feeStatus]);
    getClient(walletService).getVSPTicketsByFeeStatus(
      request,
      (error, response) =>
        error
          ? reject(error)
          : resolve({
              ticketHashes: response.getTicketsHashesList().map(rawHashToHex)
            })
    );
  });

export const syncVSPTickets = (
  walletService,
  vspHost,
  vspPubkey,
  feeAcct,
  changeAcct
) =>
  new Promise((resolve, reject) => {
    const request = new api.SyncVSPTicketsRequest();
    request.setAccount(feeAcct);
    request.setChangeAccount(changeAcct);
    request.setVspPubkey(vspPubkey);
    request.setVspHost("https://" + vspHost);

    // Call the request
    getClient(walletService).syncVSPFailedTickets(
      request,
      (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response.toObject());
      }
    );
  });

function mapTrackedVSP(vsp) {
  return {
    host: vsp.getHost(),
    tickets: vsp.getTicketsList().map((ticket) => ({
      ticketHash: rawHashToHex(ticket.getTicketHash()),
      commitmentAddress: ticket.getCommitmentAddress(),
      votingAddress: ticket.getVotingAddress(),
      fee: ticket.getFee(),
      feeHash: rawHashToHex(ticket.getFeeHash()),
      state: ticket.getState()
    }))
  };
}

export const getVSPTrackedTickets = (walletService) =>
  new Promise((ok, fail) => {
    const request = new api.GetTrackedVSPTicketsRequest();
    getClient(walletService).getTrackedVSPTickets(request, (err, res) =>
      err ? fail(err) : ok(res.getVspsList().map(mapTrackedVSP))
    );
  });

export const getPeerInfo = (walletService) =>
  new Promise((ok, fail) => {
    const request = new api.GetPeerInfoRequest();
    getClient(walletService).getPeerInfo(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const processManagedTickets = (
  walletService,
  vspHost,
  vspPubkey,
  feeAccount,
  changeAccount
) =>
  new Promise((resolve, reject) => {
    const request = new api.ProcessManagedTicketsRequest();
    request.setVspHost("https://" + vspHost);
    request.setVspPubkey(vspPubkey);
    request.setFeeAccount(feeAccount);
    request.setChangeAccount(changeAccount);

    getClient(walletService).processManagedTickets(request, (err, res) =>
      err ? reject(err) : resolve(res.toObject())
    );
  });

// processUnmanagedTicketsStartup
export const processUnmanagedTicketsStartup = (
  walletService,
  vspHost,
  vspPubkey,
  feeAccount,
  changeAccount
) =>
  new Promise((resolve, reject) => {
    const request = new api.ProcessUnmanagedTicketsRequest();
    request.setVspHost("https://" + vspHost);
    request.setVspPubkey(vspPubkey);
    request.setFeeAccount(feeAccount);
    request.setChangeAccount(changeAccount);

    getClient(walletService).processUnmanagedTickets(request, (err, response) =>
      err ? reject(err) : resolve(response.toObject())
    );
  });

export const setVspdAgendaChoices = (
  walletService,
  vspHost,
  vspPubkey,
  feeAccount,
  changeAccount
) =>
  new Promise((resolve, reject) => {
    const request = new api.SetVspdVoteChoicesRequest();
    request.setVspHost("https://" + vspHost);
    request.setVspPubkey(vspPubkey);
    request.setFeeAccount(feeAccount);
    request.setChangeAccount(changeAccount);

    getClient(walletService).setVspdVoteChoices(request, (err, res) =>
      err ? reject(err) : resolve(res.toObject())
    );
  });

export const unlockWallet = (walletService, passphrase) =>
  new Promise((resolve, reject) => {
    const unlockReq = new api.UnlockWalletRequest();
    unlockReq.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    // Unlock wallet so we can call the request.
    getClient(walletService).unlockWallet(unlockReq, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });

export const lockWallet = (walletService) =>
  new Promise((resolve, reject) => {
    const lockReq = new api.LockWalletRequest();

    getClient(walletService).lockWallet(lockReq, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });

export const unlockAccount = (walletService, passphrase, acctNumber) =>
  new Promise((resolve, reject) => {
    const unlockReq = new api.UnlockAccountRequest();
    unlockReq.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
    unlockReq.setAccountNumber(acctNumber);
    // Unlock wallet so we can call the request.
    getClient(walletService).unlockAccount(unlockReq, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });

export const lockAccount = (walletService, acctNumber) =>
  new Promise((resolve, reject) => {
    const lockReq = new api.LockAccountRequest();
    lockReq.setAccountNumber(acctNumber);
    getClient(walletService).lockAccount(lockReq, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });

export const setAccountPassphrase = (
  walletService,
  accountNumber,
  accountPassphrase,
  newAcctPassphrase,
  walletPassphrase
) =>
  new Promise((ok, fail) => {
    const request = new api.SetAccountPassphraseRequest();
    request.setAccountNumber(accountNumber);
    request.setNewAccountPassphrase(
      new Uint8Array(Buffer.from(newAcctPassphrase))
    );
    if (accountPassphrase) {
      request.setAccountPassphrase(
        new Uint8Array(Buffer.from(accountPassphrase))
      );
    }
    if (walletPassphrase) {
      request.setWalletPassphrase(
        new Uint8Array(Buffer.from(walletPassphrase))
      );
    }
    getClient(walletService).setAccountPassphrase(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });

export const startTicketAutoBuyer = (
  ticketBuyerService,
  {
    mixedAccount,
    mixedAcctBranch,
    changeAccount,
    csppServer,
    csppPort,
    balanceToMaintain,
    accountNum,
    pubkey,
    host
  }
) =>
  new Promise((ok) => {
    const request = new api.RunTicketBuyerRequest();
    if (mixedAccount && changeAccount) {
      if (
        !mixedAccount ||
        !changeAccount ||
        !csppServer ||
        !csppPort ||
        mixedAcctBranch === undefined
      ) {
        throw "missing cspp argument";
      }

      request.setMixedAccount(mixedAccount);
      request.setMixedSplitAccount(mixedAccount);
      request.setChangeAccount(changeAccount);
      request.setCsppServer(`${csppServer}:${csppPort}`);
      request.setMixedAccountBranch(mixedAcctBranch);
    }

    request.setVspPubkey(pubkey);
    request.setVspHost("https://" + host);
    request.setBalanceToMaintain(balanceToMaintain);
    request.setAccount(accountNum);
    request.setVotingAccount(accountNum);
    request.setLimit(1);

    const mixer = getClient(ticketBuyerService).runTicketBuyer(request);
    ok(shimStreamedResponse(mixer));
  });

export const discoverUsage = (walletService, gapLimit) =>
  new Promise((ok, fail) => {
    const request = new api.DiscoverUsageRequest();
    request.setGapLimit(gapLimit);
    getClient(walletService).discoverUsage(request, (err, res) =>
      err ? fail(err) : ok(res.toObject())
    );
  });
