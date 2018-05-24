import * as wallet from "wallet";
import * as sel from "selectors";
import fs from "fs";
import { isNumber, isNullOrUndefined, isUndefined } from "util";
import { tsToDate, endOfDay, reverseRawHash, formatLocalISODate } from "helpers";

const VALUE_TYPE_ATOMAMOUNT = "VALUE_TYPE_ATOMAMOUNT";
const VALUE_TYPE_DATETIME = "VALUE_TYPE_DATETIME";

export const GETSTARTUPSTATS_ATTEMPT = "GETSTARTUPSTATS_ATTEMPT";
export const GETSTARTUPSTATS_SUCCESS = "GETSTARTUPSTATS_SUCCESS";
export const GETSTARTUPSTATS_FAILED = "GETSTARTUPSTATS_FAILED";

// Calculates all startup statistics
export const getStartupStats = () => (dispatch) => {

  const startupStats = [
    { calcFunction: dailyBalancesStats },
  ];

  dispatch({ type: GETSTARTUPSTATS_ATTEMPT });
  return Promise.all(startupStats.map(s => dispatch(generateStat(s))))
    .then(([ dailyBalances ]) => {

      // the `dailyBalances` returns only days when there was a change in
      // some of the balances, so we need to fill the gaps of days without
      // changes with the previous balance, taking care to set sent/received
      // balances to 0
      dailyBalances = dailyBalances.data.slice(-15);
      const lastBalances = [];

      const date = endOfDay(new Date());
      date.setDate(date.getDate()-14);

      let idx = 0;
      for (let i = 0; i < 15; i++) {
        while (idx < dailyBalances.length-1 && dailyBalances[idx+1].time <= date) idx++;
        if (dailyBalances[idx].time.getTime() === date.getTime()) {
          lastBalances.push(dailyBalances[idx]);
        } else if (dailyBalances[idx].time.getTime() > date.getTime()) {
          // newish wallet without balance
          lastBalances.push({ series: { locked: 0, lockedNonWallet: 0, available: 0,
            total: 0, sent: 0, received: 0, voted: 0, revoked: 0, ticket: 0 },
          time: new Date(date) });
        } else {
          lastBalances.push({ series: { ...dailyBalances[idx].series, sent: 0,
            received: 0, voted: 0, revoked: 0, ticket: 0 },
          time: new Date(date) });
        }
        date.setDate(date.getDate()+1);
      }
      dispatch({ dailyBalances: lastBalances, type: GETSTARTUPSTATS_SUCCESS });
    })
    .catch(error => dispatch({ error, type: GETSTARTUPSTATS_FAILED }));
};

export const GETMYTICKETSSTATS_ATTEMPT = "GETMYTICKETSSTATS_ATTEMPT";
export const GETMYTICKETSSTATS_SUCCESS = "GETMYTICKETSSTATS_SUCCESS";
export const GETMYTICKETSSTATS_FAILED = "GETMYTICKETSSTATS_FAILED";

export const getMyTicketsStats = () => (dispatch) => {
  const startupStats = [
    { calcFunction: voteTimeStats },
  ];

  dispatch({ type: GETMYTICKETSSTATS_ATTEMPT });
  return Promise.all(startupStats.map(s => dispatch(generateStat(s))))
    .then(([ voteTime ]) => {
      dispatch({ voteTime, type: GETMYTICKETSSTATS_SUCCESS });
    })
    .catch(error => dispatch({ error, type: GETMYTICKETSSTATS_FAILED }));
};

// generateStat starts generating the statistic as defined on the opts. It
// returns a promise that gets resolved with all the data in-memory after the
// stat has been completely calculated.
export const generateStat = (opts) => (dispatch) => new Promise((resolve, reject) => {

  const { calcFunction } = opts;

  const stat = { series: null, data: [], };
  const startFunction = ({ series }) => stat.series = series;
  const endFunction = () => resolve(stat);
  const errorFunction = error => reject(error);
  const progressFunction = (time, series) => {
    stat.data.push({ time, series });
  };

  dispatch(calcFunction({ opts, startFunction, progressFunction, endFunction, errorFunction }));
});

export const EXPORT_STARTED = "EXPORT_STARTED";
export const EXPORT_COMPLETED = "EXPORT_COMPLETED";
export const EXPORT_ERROR = "EXPORT_ERROR";

export const exportStatToCSV = (opts) => (dispatch, getState) => {
  const { calcFunction, csvFilename } = opts;

  var fd;
  var allSeries;
  var seriesOpts;

  // constants (may be overriden/parametrized in the future)
  const unitDivisor = sel.unitDivisor(getState());
  const vsep = ","; // value separator
  const ln = "\n";  // line separator
  const precision = Math.ceil(Math.log10(unitDivisor)); // maximum decimal precision

  // formatting functions
  const quote = (v) => "\"" + v.replace("\"", "\\\"") + "\"";
  const formatTime = v => v ? formatLocalISODate(v) : "";
  const csvValue = (v) => isNullOrUndefined(v) ? "" : isNumber(v) ? v.toFixed(precision) : quote(v);
  const csvLine = (values) => values.map(csvValue).join(vsep);

  const seriesValueFormatFunc = (series) => {
    if (series["type"] === VALUE_TYPE_ATOMAMOUNT) {
      return v => v / unitDivisor;
    } else if (series["type"] === VALUE_TYPE_DATETIME) {
      return formatTime;
    } else {
      return v => v;
    }
  };

  // called once at the start of the stats calc function
  const startFunction = (opts) => {
    dispatch({ type: EXPORT_STARTED });
    allSeries = opts.series.map(s => ({ ...s, valueFormatFunc: seriesValueFormatFunc(s) }));
    seriesOpts = opts;
    const seriesNames = allSeries.map(s => s.name);
    const headerLine = csvLine([ "time", ...seriesNames ]);

    fd = fs.openSync(csvFilename, "w", 0o600);
    fs.writeSync(fd, headerLine);
    fs.writeSync(fd, ln);
  };

  // called once for each data line
  const progressFunction = (time, series) => {
    const values = allSeries.map(s => !isUndefined(series[s.name])
      ? s.valueFormatFunc(series[s.name])
      : null);

    !seriesOpts.noTimestamp && values.unshift(formatTime(time));
    const line = csvLine(values);
    fs.writeSync(fd, line);
    fs.writeSync(fd, ln);
  };

  const errorFunction = (error) => {
    dispatch({ error, type: EXPORT_ERROR });
    if (fd) {
      fs.closeSync(fd);
      fd = null;
    }
  };

  // called once at the end
  const endFunction = () => {
    dispatch({ filename: csvFilename, type: EXPORT_COMPLETED });
    if (fd) {
      fs.closeSync(fd);
      fd = null;
    }
  };

  dispatch(calcFunction({ opts, startFunction, progressFunction, endFunction, errorFunction }));
};

export const transactionStats = (opts) => (dispatch, getState) => {
  const { progressFunction, startFunction, endFunction, errorFunction } = opts;

  const { currentBlockHeight, walletService } = getState().grpc;

  startFunction({
    series: [
      { name: "hash" },
      { name: "type" },
      { name: "direction" },
      { name: "fee", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "amount", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "credits", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "debits", type: VALUE_TYPE_ATOMAMOUNT },
    ],
  });

  const formatTx = (tx) => {
    return {
      hash: tx.txHash,
      type: tx.txType,
      direction: tx.direction,
      fee: tx.fee,
      amount: tx.amount,
      credits: tx.tx.getCreditsList().reduce((s, c) => s + c.getAmount(), 0),
      debits: tx.tx.getDebitsList().reduce((s, d) => s + d.getPreviousAmount(), 0),
    };
  };

  const txDataCb = (mined) => {
    mined.forEach(tx => progressFunction(tsToDate(tx.timestamp), formatTx(tx)));
  };

  wallet.streamGetTransactions(walletService, 0, currentBlockHeight, 0, txDataCb)
    .then(endFunction)
    .catch(errorFunction);
};

export const balancesStats = (opts) => (dispatch, getState) => {
  const { progressFunction, startFunction, endFunction, errorFunction } = opts;

  const { currentBlockHeight, walletService, decodeMessageService,
    recentBlockTimestamp, balances } = getState().grpc;

  const backwards = !!opts.backwards;

  const chainParams = sel.chainParams(getState());

  startFunction({
    series: [
      { name: "spendable", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "immature", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "locked", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "immatureNonWallet", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "lockedNonWallet", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "total", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "stakeRewards", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "stakeFees", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "totalStake", type: VALUE_TYPE_ATOMAMOUNT },
    ],
  });

  let liveTickets = {}; // live by hash
  let maturingTxs = {}; // maturing by height
  let recordTicket = (tx, commitAmount, isWallet) => {
    liveTickets[tx.txHash] = { tx, commitAmount, isWallet };
    let ticketMatureHeight = tx.height + chainParams.TicketMaturity;
    maturingTxs[ticketMatureHeight] = maturingTxs[ticketMatureHeight] || [];
    maturingTxs[ticketMatureHeight].push({ tx, amount: commitAmount, isWallet,
      isTicket: true });
  };
  let recordVoteRevoke = (tx, amount, isWallet) => {
    let matureHeight = tx.height + chainParams.CoinbaseMaturity;
    maturingTxs[matureHeight] = maturingTxs[matureHeight] || [];
    maturingTxs[matureHeight].push({ tx, amount, isWallet, isTicket: false });
  };

  // changes in an sstx are the even-numbered, > 0 txouts
  const isTicketChange = (c) => (c.getIndex() > 0) && (c.getIndex() % 2) === 0;

  // a ticket "belongs" to the wallet when the wallet has the private key
  // that can be used to vote/revoke the ticket (ie: if the wallet considers the
  // txout with index === 0 a credit).
  const isWalletTicket = (tx) => (tx.getCreditsList().length > 0) && (tx.getCreditsList()[0].getIndex() === 0);

  // return the balance deltas from recorded tickets/votes/revokes that matured
  // in the interval fromHeight..toHeight
  let findMaturingDeltas = (fromHeight, toHeight, fromTimestamp, toTimestamp) => {

    // largeStakeTimeDiff === true when the time+height difference to calculate
    // the maturity is so large that it's better to estimate the maturity time
    // using chainParams.TargetTimePerBlock instead of linearly interpolating
    // the time between fromTimestamp...toTimestamp
    const largeStakeTimeDiff =
      ((toHeight - fromHeight) > chainParams.TicketMaturity) &&
      (toTimestamp - fromTimestamp) >
      (toHeight - fromHeight) * chainParams.TargetTimePerBlock;

    let blockInterval = (toTimestamp - fromTimestamp) / (toHeight - fromHeight);

    let start = backwards ? toHeight : fromHeight;
    let end = backwards ? fromHeight : toHeight;
    let inc = backwards ? -1 : +1;
    let test = h => backwards ? h >= end : h <= end;

    let res = [];
    for (let h = start; test(h); h += inc) {
      if (!maturingTxs[h]) continue;
      maturingTxs[h].forEach(({ tx, amount, isWallet, isTicket }) => {
        let timestamp;
        if (fromHeight === toHeight) {
          // fromHeigh === toHeight === h, so toTimestamp is already the block
          // maturation timestamp
          timestamp = toTimestamp;
        } else if (largeStakeTimeDiff) {
          // this way of estimating the timestamp is better when the differences
          // between fromHeight/toHeight are bigger than the maturity period, so
          // we don't have information more accurate than TargetTimePerBlock
          timestamp = fromTimestamp + (h - fromHeight) * chainParams.TargetTimePerBlock;
        } else {
          // the next transactions all happen after after toTimestamp, so the
          // stake amount *definitely* matured on a block between these times.
          // Since we don't have a good index of blockHeight => timestamp to use,
          // estimate the maturation timestamp by linearly interpolating the
          // times as if the blocks between fromHeight...toHeight were mined in
          // regular intervals
          timestamp = fromTimestamp + ((h - fromHeight) * blockInterval);
        }

        res.push({
          spendable: !isTicket ? amount*inc : 0, // isTicket == false means vote, revoke, coinbase
          immature: isWallet ? -amount*inc : 0,
          immatureNonWallet: isWallet ? 0 : -amount*inc,
          locked: isWallet && isTicket ? amount*inc : 0,
          lockedNonWallet: !isWallet && isTicket ? amount*inc : 0,
          voted: 0, revoked: 0, sent: 0, received: 0, ticket: 0,
          stakeRewards: 0, stakeFees: 0, totalStake: 0,
          timestamp, tx });
      });
    }
    return res;
  };

  // closure that calcs ticket info necessary to correctly account for its delta
  // to balances, given a ticket tx
  const ticketInfo = tx => {
    const change = tx.tx.getCreditsList().reduce((s, c) => s + isTicketChange(c) ? c.getAmount() : 0, 0);
    const isWallet = isWalletTicket(tx.tx);
    const debitsSum = tx.tx.getDebitsList().reduce((s, d) => s + d.getPreviousAmount(), 0);
    const commitAmount = debitsSum - change - (isWallet ? tx.tx.getFee() : 0);
    const spentAmount = commitAmount + (isWallet ? tx.fee : 0);
    const purchaseFees = debitsSum - commitAmount;
    return { isWallet, commitAmount, spentAmount, purchaseFees };
  };

  // closure that cals vote/revoke info necessary to correctly account for its
  // delta to balances, given a vote/revoke tx
  const voteRevokeInfo = async tx => {
    const isVote = tx.txType === wallet.TRANSACTION_TYPE_VOTE;
    const decodedSpender = await wallet.decodeTransaction(decodeMessageService, tx.tx.getTransaction());
    const spenderInputs = decodedSpender.getTransaction().getInputsList();
    const ticketHash = reverseRawHash(spenderInputs[spenderInputs.length-1].getPreviousTransactionHash());
    let ticket = liveTickets[ticketHash];
    if (!ticket) {
      const ticketTx = await wallet.getTransaction(walletService, ticketHash);
      if (!ticketTx) {
        throw "Previous live ticket not found: " + ticketHash;
      }
      ticket = ticketInfo(ticketTx);
    }
    const ticketCommitAmount = ticket.commitAmount;
    const returnAmount = tx.tx.getCreditsList().reduce((s, c) => s + c.getAmount(), 0);
    const wasWallet = ticket.isWallet;
    const stakeResult = returnAmount - ticketCommitAmount;
    return { wasWallet, isVote, returnAmount, stakeResult, ticketCommitAmount };
  };

  // closure that calcs how much each tx affects each balance type.
  // Ticket and vote/revoke delta calculation assumes *a lot* about how tickets
  // are encoded (1st txout === ticket, odds are commitments, etc). If consensus
  // rules change the "shape" of a ticket tx in the future, this will need to be
  // heavily revised.
  const txBalancesDelta = async (tx) => {
    // tx.amount is negative in sends/tickets/transfers already
    let delta = null;
    switch (tx.txType) {
    case wallet.TRANSACTION_TYPE_TICKET_PURCHASE:
      var { isWallet, commitAmount, spentAmount, purchaseFees } = ticketInfo(tx);
      recordTicket(tx, commitAmount, isWallet);
      delta = { spendable: -spentAmount, immature: isWallet ? commitAmount : 0,
        immatureNonWallet: isWallet ? 0 : commitAmount, voted: 0, revoked: 0,
        sent: 0, received: 0, ticket: commitAmount, locked: 0, lockedNonWallet: 0,
        stakeRewards: 0, stakeFees: purchaseFees, totalStake: spentAmount,
        timestamp: tx.timestamp, tx };
      break;
    case wallet.TRANSACTION_TYPE_VOTE:
    case wallet.TRANSACTION_TYPE_REVOCATION:
      var { wasWallet, isVote, returnAmount, stakeResult,
        ticketCommitAmount } = await voteRevokeInfo(tx);
      recordVoteRevoke(tx, returnAmount, wasWallet);
      delta = { spendable: 0, locked: wasWallet ? -ticketCommitAmount : 0,
        lockedNonWallet: wasWallet ? 0 : -ticketCommitAmount,
        voted: isVote ? returnAmount : 0, revoked: !isVote ? returnAmount : 0,
        sent: 0, received: 0, ticket: 0,
        immature: wasWallet ? returnAmount : 0,
        immatureNonWallet: wasWallet ? 0 : returnAmount,
        stakeFees: isVote ? 0 : -stakeResult, stakeRewards: isVote ? stakeResult : 0,
        totalStake: 0, timestamp: tx.timestamp, tx };
      break;
    case wallet.TRANSACTION_TYPE_COINBASE:
    case wallet.TRANSACTION_TYPE_REGULAR:
      delta = { spendable: +tx.amount, locked: 0, lockedNonWallet: 0, voted: 0,
        revoked: 0, sent: tx.amount < 0 ? tx.amount : 0,
        received: tx.amount > 0 ? tx.amount : 0, ticket: 0, immature: 0,
        stakeFees: 0, stakeRewards: 0, totalStake: 0,
        immatureNonWallet: 0, timestamp: tx.timestamp, tx };
      break;
    default: throw "Unknown tx type: " + tx.txType;
    }

    if (backwards) {
      const fields = [ "spendable", "locked", "lockedNonWallet", "voted",
        "revoked", "sent", "received", "stakeFees", "stakeRewards",
        "totalStake", "immatureNonWallet" ];
      fields.forEach(f => delta[f] = -delta[f]);
    }

    return delta;
  };

  // running balance totals
  let currentBalance = { spendable: 0, immature: 0, immatureNonWallet: 0,
    locked: 0, lockedNonWallet: 0, total: 0, stakeRewards: 0, stakeFees: 0,
    totalStake: 0, delta: { voted: 0, revoked: 0, ticket: 0, sent: 0, received: 0 } };
  if (backwards) {
    currentBalance = balances.reduce((cb, acct) => {
      cb.spendable += acct.spendable;
      cb.immature += acct.immatureStakeGeneration + acct.immatureReward;
      return cb;
    }, currentBalance);
  }

  // account for this delta in the balances and call the progress function
  let addDelta = (delta) => {
    currentBalance = {
      spendable: currentBalance.spendable + delta.spendable,
      immature: currentBalance.immature + delta.immature,
      immatureNonWallet: currentBalance.immatureNonWallet + delta.immatureNonWallet,
      locked: currentBalance.locked + delta.locked,
      lockedNonWallet: currentBalance.lockedNonWallet + delta.lockedNonWallet,
      stakeRewards: currentBalance.stakeRewards + delta.stakeRewards,
      stakeFees: currentBalance.stakeFees + delta.stakeFees,
      totalStake: currentBalance.totalStake + delta.totalStake,
      delta,
    };
    currentBalance.total = currentBalance.spendable + currentBalance.locked +
      currentBalance.immature;
    progressFunction(tsToDate(delta.timestamp), currentBalance);
  };

  let lastTxHeight = 0;
  let lastTxTimestamp = chainParams.GenesisTimestamp;
  const txDataCb = async ({ mined }) => {
    for (let i = 0; i < mined.length; i++) {
      const tx = mined[i];
      const maturedDeltas = findMaturingDeltas(lastTxHeight+1, tx.height,
        lastTxTimestamp, tx.timestamp);
      maturedDeltas.forEach(addDelta);

      const delta = await txBalancesDelta(tx);
      addDelta(delta);

      lastTxHeight = tx.height;
      lastTxTimestamp = delta.timestamp;
    }

    // check for remaining tickets that may have matured
    const maturedDeltas = findMaturingDeltas(lastTxHeight+1, currentBlockHeight,
      lastTxTimestamp, recentBlockTimestamp || Date.now());
    maturedDeltas.forEach(addDelta);

    endFunction();
  };

  // Closure to process transactions backwards. This is slightly tricky as
  // going backwards, when we process transaction X, the current balance may be
  // affect by this or earlier transaction's immature balances. So we process
  // the txs by collecting the maturing transactions that might affect tx `i`,
  // processing them first, then processing tx i.
  const txDataCbBackwards = async ({ mined }) => {
    let now = new Date();
    let toAddDeltas = {};
    let lastTxHeight = currentBlockHeight;
    let lastTxTimestamp = now.getTime() / 1000;
    const maturityBlocks = Math.max(chainParams.CoinbaseMaturity, chainParams.TicketMaturity);

    progressFunction(now, currentBalance);

    for (let i = 0; i < mined.length; i++) {
      const tx = mined[i];
      const delta = toAddDeltas[i] ? toAddDeltas[i] : await txBalancesDelta(tx);

      let j = i+1;
      while ((j < mined.length) && (mined[j].height >= tx.height - maturityBlocks)) {
        // this tx might influence the balance of tx[i]. So calculate its delta,
        // which will fill `maturingTxs` as needed
        toAddDeltas[j] = await(txBalancesDelta(mined[j]));
        j++;
      }

      const maturedDeltas = findMaturingDeltas(tx.height, lastTxHeight,
        tx.timestamp, lastTxTimestamp);
      maturedDeltas.forEach(addDelta);
      addDelta(delta);

      lastTxHeight = tx.height;
      lastTxTimestamp = delta.timestamp;
    }
    endFunction();
  };

  const startBlock = backwards ? currentBlockHeight : 0;
  const endBlock = backwards ? 1 : currentBlockHeight;
  wallet.getTransactions(walletService, startBlock, endBlock)
    .then(backwards ? txDataCbBackwards : txDataCb)
    .catch(errorFunction);
};

export const dailyBalancesStats = (opts) => {
  const { progressFunction, endFunction, startFunction } = opts;

  let lastDate = null;
  let balance = { spendable: 0, locked: 0, total: 0, sent: 0, received: 0,
    voted: 0, revoked: 0, ticket: 0 };

  const differentDays = (d1, d2) =>
    (d1.getYear() !== d2.getYear()) ||
    (d1.getMonth() !== d2.getMonth()) ||
    (d1.getDate() !== d2.getDate());

  const aggStartFunction = (opts) => {
    opts.series = [ ...opts.series,
      { name: "sent", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "received", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "voted", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "revoked", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "ticket", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "stakeRewards", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "stakeFees", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "totalStake", type: VALUE_TYPE_ATOMAMOUNT },
    ];
    startFunction(opts);
  };

  const aggProgressFunction = (time, series) => {
    if (!lastDate) {
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    } else if (differentDays(time, lastDate)) {
      progressFunction(endOfDay(lastDate), balance);
      balance = { ...balance, sent: 0, received: 0, voted: 0, revoked: 0, ticket: 0 };
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    }
    const { delta } = series;
    balance = {
      ...series,
      sent: balance.sent + delta.sent,
      received: balance.received + delta.received,
      voted: balance.voted + delta.voted,
      revoked: balance.revoked + delta.revoked,
      ticket: balance.ticket + delta.ticket,
    };
  };

  const aggEndFunction = () => {
    progressFunction(endOfDay(lastDate), balance);
    endFunction();
  };

  return balancesStats({ ...opts, progressFunction: aggProgressFunction,
    endFunction: aggEndFunction, startFunction: aggStartFunction });
};

export const voteTimeStats = (opts) => (dispatch, getState) => {

  const chainParams = sel.chainParams(getState());
  const { progressFunction, endFunction, startFunction, errorFunction } = opts;
  const { currentBlockHeight, walletService, } = getState().grpc;

  const blocksPerDay = (60 * 60 * 24) / chainParams.TargetTimePerBlock;
  const expirationDays = Math.ceil((chainParams.TicketExpiry + chainParams.TicketMaturity) / blocksPerDay);
  const dayBuckets = Array(expirationDays+1).fill(0);

  startFunction({
    series: [
      { name: "daysToVote" },
      { name: "count" },
    ],
    noTimestamp: true
  });

  const txDataCb = (tickets) => {
    tickets.forEach(t => {
      if (t.status !== "voted") return;
      const daysToVote = Math.floor((t.spender.getTimestamp() - t.ticket.getTimestamp()) / (24 * 60 * 60));
      dayBuckets[daysToVote] += 1;
    });

    dayBuckets.forEach((count, daysToVote) => {
      progressFunction(null, { daysToVote, count });
    });

    endFunction();
  };

  wallet.getTickets(walletService, 0, currentBlockHeight)
    .then(txDataCb)
    .catch(errorFunction);
};

export const ticketStats = (opts) => (dispatch, getState) => {

  const { progressFunction, endFunction, startFunction, errorFunction } = opts;
  const { currentBlockHeight, walletService, } = getState().grpc;

  startFunction({
    series: [
      { name: "spenderTimestamp", type: VALUE_TYPE_DATETIME },
      { name: "status" },
      { name: "ticketHash" },
      { name: "spenderHash" },
      { name: "sentAmount", type: VALUE_TYPE_ATOMAMOUNT },
      { name: "returnedAmount", type: VALUE_TYPE_ATOMAMOUNT },
    ],
  });

  const normalizeTicket = sel.ticketNormalizer(getState());
  const txDataCb = (tickets) => {
    tickets.forEach(t => {

      const ticket = normalizeTicket(t);
      progressFunction(tsToDate(ticket.enterTimestamp), {
        spenderTimestamp: ticket.leaveTimestamp ? tsToDate(ticket.leaveTimestamp) : null,
        status: ticket.status,
        ticketHash: ticket.hash,
        spenderHash: ticket.spenderHash,
        sentAmount: ticket.ticketInvestment,
        returnedAmount: ticket.ticketReturnAmount,
      });

    });

    endFunction();
  };

  wallet.getTickets(walletService, 0, currentBlockHeight)
    .then(txDataCb)
    .catch(errorFunction);
};
