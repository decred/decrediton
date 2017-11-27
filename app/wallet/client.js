import Promise from "promise";
import { TicketTypes } from "helpers/tickets";
import * as api from "middleware/walletrpc/api_pb";

const promisifyReq = (fnName, Req) => (service, ...args) => new Promise((ok, fail) =>
  service[fnName](new Req(), ...args, (err, res) => err ? fail(err) : ok(res)));

export const getNetwork = promisifyReq("network", api.NetworkRequest);
export const getStakeInfo = promisifyReq("stakeInfo", api.StakeInfoRequest);
export const getTicketPrice = promisifyReq("ticketPrice", api.TicketPriceRequest);
export const getAccounts = promisifyReq("accounts", api.AccountsRequest);
export const getAgendas = promisifyReq("agendas", api.AgendasRequest);
export const getVoteChoices = promisifyReq("voteChoices", api.VoteChoicesRequest);
export const doPing = promisifyReq("ping", api.PingRequest);
export const loadActiveDataFilters = promisifyReq("loadActiveDataFilters", api.LoadActiveDataFiltersRequest);
export const getTicketBuyerConfig = promisifyReq("ticketBuyerConfig", api.TicketBuyerConfigRequest);
export const stopAutoBuyer = promisifyReq("stopAutoBuyer", api.StopAutoBuyerRequest);

export const getBalance = (walletService, accountNum, requiredConfs) => new Promise((ok, fail) => {
  const request = new api.BalanceRequest();
  request.setAccountNumber(accountNum);
  request.setRequiredConfirmations(requiredConfs);
  walletService.balance(request, (err, res) => err ? fail(err) : ok(res));
});

export const getAccountNumber = (walletService, accountName) => new Promise((ok, fail) => {
  const request = new api.AccountNumberRequest();
  request.setAccountName(accountName);
  walletService.accountNumber(request, (err, res) => err ? fail(err) : ok(res));
});

export const getTickets = (walletService, startHeight, endHeight) => new Promise((ok, fail) => {
  const tickets = [];
  const request = new api.GetTicketsRequest();
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
});

export const setAgendaVote = (votingService, agendaId, choiceId) => new Promise((ok, fail) => {
  const request = new api.SetVoteChoicesRequest();
  const choice = new api.SetVoteChoicesRequest.Choice();
  choice.setChoiceId(choiceId);
  choice.setAgendaId(agendaId);
  request.addChoices(choice);
  votingService.setVoteChoices(request, (err, res) => err ? fail(err) : ok(res));
});
