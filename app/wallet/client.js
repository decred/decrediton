import Promise from "promise";
import { TicketTypes } from "helpers/tickets";
import {
  PingRequest, NetworkRequest, AccountNumberRequest, AccountsRequest,
  BalanceRequest, TicketPriceRequest, StakeInfoRequest,
  AgendasRequest, VoteChoicesRequest, SetVoteChoicesRequest, GetTicketsRequest,
} from "middleware/walletrpc/api_pb";
import { withLog as log, logOptionNoResponseData, withLogNoData, withLogNoResponseData } from "./app";

const promisifyReq = (fnName, Req) => log((service, ...args) => new Promise((ok, fail) =>
  service[fnName](new Req(), ...args, (err, res) => err ? fail(err) : ok(res))), fnName);

const promisifyReqLogNoData = (fnName, Req) => withLogNoData((service, ...args) => new Promise((ok, fail) =>
  service[fnName](new Req(), ...args, (err, res) => err ? fail(err) : ok(res))), fnName);

export const getNetwork = promisifyReq("network", NetworkRequest);
export const getStakeInfo = promisifyReqLogNoData("stakeInfo", StakeInfoRequest);
export const getTicketPrice = promisifyReq("ticketPrice", TicketPriceRequest);
export const getAccounts = promisifyReqLogNoData("accounts", AccountsRequest);
export const getAgendas = promisifyReq("agendas", AgendasRequest);
export const getVoteChoices = promisifyReq("voteChoices", VoteChoicesRequest);
export const doPing = promisifyReq("ping", PingRequest);

export const getBalance = withLogNoResponseData((walletService, accountNum, requiredConfs) => new Promise((ok, fail) => {
  const request = new BalanceRequest();
  request.setAccountNumber(accountNum);
  request.setRequiredConfirmations(requiredConfs);
  walletService.balance(request, (err, res) => err ? fail(err) : ok(res));
}), "Get Balance");

export const getAccountNumber = log((walletService, accountName) => new Promise((ok, fail) => {
  const request = new AccountNumberRequest();
  request.setAccountName(accountName);
  walletService.accountNumber(request, (err, res) => err ? fail(err) : ok(res));
}), "Get Account Number");

export const getTickets = log((walletService, startHeight, endHeight) => new Promise((ok, fail) => {
  const tickets = [];
  const request = new GetTicketsRequest();
  request.setStartingBlockHeight(startHeight);
  request.setEndingBlockHeight(endHeight);
  const getTx = walletService.getTickets(request);
  getTx.on("data", res => tickets.unshift({
    status: TicketTypes.get(res.getTicket().getTicketStatus()),
    ticket: res.getTicket().getTicket(),
    spender: res.getTicket().getSpender()
  }));
  getTx.on("end", () => ok(tickets));
  getTx.on("error", fail);
}), "Get Tickets", logOptionNoResponseData());

export const setAgendaVote = log((votingService, agendaId, choiceId) =>
  new Promise((ok, fail) => {
    const request = new SetVoteChoicesRequest();
    const choice = new SetVoteChoicesRequest.Choice();
    choice.setChoiceId(choiceId);
    choice.setAgendaId(agendaId);
    request.addChoices(choice);
    votingService.setVoteChoices(request, (err, res) => err ? fail(err) : ok(res));
  }),
"Set Agenda Vote");
