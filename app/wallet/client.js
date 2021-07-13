import { TicketTypes } from "helpers/tickets";
import {
  strHashToRaw,
  rawHashToHex,
  rawToHex,
  hexToBytes
} from "../helpers/byteActions";
import { shimStreamedResponse } from "helpers/electronRenderer";
import {
  withLog as log,
  logOptionNoResponseData,
  withLogNoData,
  withLogNoResponseData
} from "./app";
import { walletrpc as api } from "middleware/walletrpc/api_pb";
import { getClient } from "middleware/grpc/clientTracking";
import { formatTransaction, formatUnminedTransaction } from "./service";

const promisifyReq = (fnName, Req) =>
  log(
    (service, ...args) =>
      new Promise((ok, fail) =>
        getClient(service)[fnName](new Req(), ...args, (err, res) =>
          err ? fail(err) : ok(res.toObject())
        )
      ),
    fnName
  );

const promisifyReqLogNoData = (fnName, Req) =>
  withLogNoData(
    (service, ...args) =>
      new Promise((ok, fail) =>
        getClient(service)[fnName](new Req(), ...args, (err, res) =>
          err ? fail(err) : ok(res.toObject())
        )
      ),
    fnName
  );

export const bestBlock = promisifyReq("bestBlock", api.BestBlockRequest);
export const getNetwork = promisifyReq("network", api.NetworkRequest);
export const getStakeInfo = promisifyReqLogNoData(
  "stakeInfo",
  api.StakeInfoRequest
);
export const getTicketPrice = promisifyReq(
  "ticketPrice",
  api.TicketPriceRequest
);
export const getAccounts = promisifyReqLogNoData(
  "accounts",
  api.AccountsRequest
);
export const getAgendas = promisifyReq("agendas", api.AgendasRequest);
export const getVoteChoices = promisifyReq(
  "voteChoices",
  api.VoteChoicesRequest
);
export const getTreasuryPolicies = log(
  (walletService) =>
    new Promise((ok, fail) => {
      const request = new api.TreasuryPoliciesRequest();
      getClient(walletService).treasuryPolicies(request, (err, res) => {
        if (err) {
          fail(err);
          return;
        }
        const resObj = res.toObject();
        resObj.policiesList = res.getPoliciesList().map((r) => ({
          key: rawToHex(r.getKey()),
          policy: r.getPolicy()
        }));
        ok(resObj);
      });
    }),
  "Get Treasury Policies",
  logOptionNoResponseData()
);
export const loadActiveDataFilters = promisifyReq(
  "loadActiveDataFilters",
  api.LoadActiveDataFiltersRequest
);
export const getTicketBuyerConfig = promisifyReq(
  "ticketBuyerConfig",
  api.TicketBuyerConfigRequest
);
export const stopAutoBuyer = promisifyReq(
  "stopAutoBuyer",
  api.StopAutoBuyerRequest
);

export const getBalance = withLogNoResponseData(
  (walletService, accountNum, requiredConfs) =>
    new Promise((ok, fail) => {
      const request = new api.BalanceRequest();
      request.setAccountNumber(accountNum);
      request.setRequiredConfirmations(requiredConfs);
      getClient(walletService).balance(request, (err, res) =>
        err ? fail(err) : ok(res.toObject())
      );
    }),
  "Get Balance"
);

export const getAccountNumber = log(
  (walletService, accountName) =>
    new Promise((ok, fail) => {
      const request = new api.AccountNumberRequest();
      request.setAccountName(accountName);
      getClient(walletService).accountNumber(request, (err, res) =>
        err ? fail(err) : ok(res.toObject())
      );
    }),
  "Get Account Number"
);

function formatTicket(res) {
  const formatBlock = (b) => ({
    hash: rawHashToHex(b.getHash()),
    height: b.getHeight(),
    timestamp: b.getTimestamp()
  });

  const r = {
    status: TicketTypes.get(res.getTicket().getTicketStatus()),
    block: res.getBlock() ? formatBlock(res.getBlock()) : null
  };

  if (res.getBlock()) {
    r.ticket = formatTransaction(res.getBlock(), res.getTicket().getTicket());
  } else {
    r.ticket = formatUnminedTransaction(res.getTicket().getTicket(), 0);
  }

  // The getTicket(s) call only returns the block for the ticket, so we format
  // the spender tx as if it was unmined (even though it might actually be mined).
  r.spender = formatUnminedTransaction(res.getTicket().getSpender(), 0);

  r.ticket.hash = rawHashToHex(res.getTicket().getTicket().getHash());
  r.ticket.transaction = rawHashToHex(
    res.getTicket().getTicket().getTransaction()
  );
  if (res.getTicket().getSpender().getHash()) {
    r.spender.hash = rawHashToHex(res.getTicket().getSpender().getHash());
    r.spender.transaction = rawHashToHex(
      res.getTicket().getSpender().getTransaction()
    );
  }
  r.ticket.vspHost = res.getVspHost();
  return r;
}

export const getTickets = log(
  (walletService, startHeight, endHeight, targetCount) =>
    new Promise((ok, fail) => {
      const tickets = [];
      const request = new api.GetTicketsRequest();
      request.setStartingBlockHeight(startHeight);
      request.setEndingBlockHeight(endHeight);
      request.setTargetTicketCount(targetCount);
      const getTx = getClient(walletService).getTickets(request);
      getTx.on("data", (res) => {
        tickets.push(formatTicket(res));
      });
      getTx.on("end", () => ok(tickets));
      getTx.on("error", fail);
    }),
  "Get Tickets",
  logOptionNoResponseData()
);

export const getTicket = log(
  (walletService, ticketHash) =>
    new Promise((ok, fail) => {
      const request = new api.GetTicketRequest();
      request.setTicketHash(ticketHash);
      getClient(walletService).getTicket(request, (err, res) => {
        if (err) {
          fail(err);
          return;
        }
        ok(formatTicket(res));
      });
    }),
  "Get Ticket",
  logOptionNoResponseData()
);

export const setAgendaVote = log(
  (votingService, agendaId, choiceId) =>
    new Promise((ok, fail) => {
      const request = new api.SetVoteChoicesRequest();
      const choice = new api.SetVoteChoicesRequest.Choice();
      choice.setChoiceId(choiceId);
      choice.setAgendaId(agendaId);
      request.addChoices(choice);
      getClient(votingService).setVoteChoices(request, (err, res) =>
        err ? fail(err) : ok(res.toObject())
      );
    }),
  "Set Agenda Vote"
);

export const setTreasuryPolicy = log(
  (votingService, key, policy) =>
    new Promise((ok, fail) => {
      const request = new api.SetTreasuryPolicyRequest();
      request.setKey(hexToBytes(key));
      request.setPolicy(policy);
      getClient(votingService).setTreasuryPolicy(request, (err, res) =>
        err ? fail(err) : ok(res.toObject())
      );
    }),
  "Set Treasury Policy"
);

export const importVotingAccountFromSeed = log(
  (walletService, seed, name, passphrase, rescan, scanFrom) =>
    new Promise((ok, fail) => {
      const request = new api.ImportVotingAccountFromSeedRequest();
      request.setSeed(seed);
      request.setName(name);
      request.setPassphrase(new Uint8Array(Buffer.from(passphrase)));
      request.setRescan(rescan);
      request.setScanFrom(scanFrom);
      getClient(walletService).importVotingAccountFromSeed(
        request,
        (err, res) => (err ? fail(err) : ok(res.toObject()))
      );
    }),
  "Import Voting Account From Seed"
);

export const abandonTransaction = log(
  (walletService, txHash) =>
    new Promise((resolve, reject) => {
      const req = new api.AbandonTransactionRequest();
      req.setTransactionHash(
        Buffer.isBuffer(txHash) ? txHash : strHashToRaw(txHash)
      );
      getClient(walletService).abandonTransaction(req, (err) =>
        err ? reject(err) : resolve()
      );
    }),
  "Abandon Transaction"
);

export const runAccountMixerRequest = (
  walletService,
  { mixedAccount, mixedAccountBranch, changeAccount, csppServer }
) =>
  new Promise((ok) => {
    const request = new api.RunAccountMixerRequest();
    request.setMixedAccount(mixedAccount);
    request.setMixedAccountBranch(mixedAccountBranch);
    request.setChangeAccount(changeAccount);
    request.setCsppServer(csppServer);
    const mixer = getClient(walletService).runAccountMixer(request);
    ok(shimStreamedResponse(mixer));
  });
