import Promise from "promise";
import { TicketTypes } from "helpers/tickets";
import { withLog as log, logOptionNoResponseData, withLogNoData, withLogNoResponseData } from "./app";
import * as api from "middleware/walletrpc/api_pb";

const promisifyReq = (fnName, Req) => log((service, ...args) => new Promise((ok, fail) =>
  service[fnName](new Req(), ...args, (err, res) => err ? fail(err) : ok(res))), fnName);

const promisifyReqLogNoData = (fnName, Req) => withLogNoData((service, ...args) => new Promise((ok, fail) =>
  service[fnName](new Req(), ...args, (err, res) => err ? fail(err) : ok(res))), fnName);

export const bestBlock = promisifyReq("bestBlock", api.BestBlockRequest);
export const getNetwork = promisifyReq("network", api.NetworkRequest);
export const getStakeInfo = promisifyReqLogNoData("stakeInfo", api.StakeInfoRequest);
export const getTicketPrice = promisifyReq("ticketPrice", api.TicketPriceRequest);
export const getAccounts = promisifyReqLogNoData("accounts", api.AccountsRequest);
export const getAgendas = promisifyReq("agendas", api.AgendasRequest);
export const getVoteChoices = promisifyReq("voteChoices", api.VoteChoicesRequest);
export const doPing = promisifyReq("ping", api.PingRequest);
export const loadActiveDataFilters = promisifyReq("loadActiveDataFilters", api.LoadActiveDataFiltersRequest);
export const getTicketBuyerConfig = promisifyReq("ticketBuyerConfig", api.TicketBuyerConfigRequest);
export const stopAutoBuyer = promisifyReq("stopAutoBuyer", api.StopAutoBuyerRequest);

export const getBalance = withLogNoResponseData((walletService, accountNum, requiredConfs) => new Promise((ok, fail) => {
  const request = new api.BalanceRequest();
  request.setAccountNumber(accountNum);
  request.setRequiredConfirmations(requiredConfs);
  walletService.balance(request, (err, res) => err ? fail(err) : ok(res));
}), "Get Balance");

export const getAccountNumber = log((walletService, accountName) => new Promise((ok, fail) => {
  const request = new api.AccountNumberRequest();
  request.setAccountName(accountName);
  walletService.accountNumber(request, (err, res) => err ? fail(err) : ok(res));
}), "Get Account Number");

export const getTickets = log((walletService, startHeight, endHeight, targetCount) => new Promise((ok, fail) => {
  const tickets = [];
  const request = new api.GetTicketsRequest();
  request.setStartingBlockHeight(startHeight);
  request.setEndingBlockHeight(endHeight);
  request.setTargetTicketCount(targetCount);
  const getTx = walletService.getTickets(request);
  getTx.on("data", res => {
    tickets.push({
      status: TicketTypes.get(res.getTicket().getTicketStatus()),
      ticket: res.getTicket().getTicket(),
      spender: res.getTicket().getSpender(),
      block: res.getBlock(),
    });
  });
  getTx.on("end", () => ok(tickets));
  getTx.on("error", fail);
}), "Get Tickets", logOptionNoResponseData());

export const getTicket = log((walletService, ticketHash) =>
  new Promise((ok, fail) => {
    const request = new api.GetTicketRequest();
    request.setTicketHash(ticketHash);
    walletService.getTicket(request, (err, res) => {
      if (err) {
        fail(err);
        return;
      }

      const ticket = {
        status: TicketTypes.get(res.getTicket().getTicketStatus()),
        ticket: res.getTicket().getTicket(),
        spender: res.getTicket().getSpender(),
        block: res.getBlock(),
      };

      ok(ticket);
    });
  }), "Get Ticket", logOptionNoResponseData());

export const setAgendaVote = log((votingService, agendaId, choiceId) =>
  new Promise((ok, fail) => {
    const request = new api.SetVoteChoicesRequest();
    const choice = new api.SetVoteChoicesRequest.Choice();
    choice.setChoiceId(choiceId);
    choice.setAgendaId(agendaId);
    request.addChoices(choice);
    votingService.setVoteChoices(request, (err, res) => err ? fail(err) : ok(res));
  }), "Set Agenda Vote");
