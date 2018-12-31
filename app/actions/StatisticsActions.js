import * as wallet from "wallet";
import * as sel from "selectors";
import fs from "fs";
import { isNumber, isNullOrUndefined, isUndefined } from "util";
import { endOfDay, reverseRawHash, formatLocalISODate, isSameDate } from "helpers";

const VALUE_TYPE_ATOMAMOUNT = "VALUE_TYPE_ATOMAMOUNT";
const VALUE_TYPE_DATETIME = "VALUE_TYPE_DATETIME";

export const GETSTARTUPSTATS_ATTEMPT = "GETSTARTUPSTATS_ATTEMPT";
export const GETSTARTUPSTATS_SUCCESS = "GETSTARTUPSTATS_SUCCESS";
export const GETSTARTUPSTATS_FAILED = "GETSTARTUPSTATS_FAILED";

// Calculates all startup statistics
export const getStartupStats = () => (dispatch, getState) => {

  if (getState().statistics.getStartupStatsAttempt) {
    return;
  }

  dispatch({ type: GETSTARTUPSTATS_ATTEMPT });

  const startCalcTime = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate()-16);

  return dispatch(generateStat({ calcFunction: dailyBalancesStats, backwards: true, endDate }))
    .then( dailyBalances => {

      // the `dailyBalances` returns only days when there was a change in
      // some of the balances, so we need to fill the gaps of days without
      // changes with the previous balance, taking care to set sent/received
      // balances to 0
      dailyBalances = dailyBalances.data.slice(0, 15).reverse();
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

      const endCalcTime = new Date();
      const startupStatsCalcSeconds = (endCalcTime.getTime() - startCalcTime.getTime()) / 1000;
      dispatch({ dailyBalances: lastBalances, startupStatsCalcSeconds,
        startupStatsEndCalcTime: endCalcTime, type: GETSTARTUPSTATS_SUCCESS });
    })
    .catch(error => {
      console.error("getStartupStats errored", error);
      dispatch({ error, type: GETSTARTUPSTATS_FAILED });
    });
};

export const GETMYTICKETSSTATS_ATTEMPT = "GETMYTICKETSSTATS_ATTEMPT";
export const GETMYTICKETSSTATS_SUCCESS = "GETMYTICKETSSTATS_SUCCESS";
export const GETMYTICKETSSTATS_FAILED = "GETMYTICKETSSTATS_FAILED";

export const getMyTicketsStats = () => (dispatch) => {
  const startupStats = [
    { calcFunction: voteTimeStats },
    { calcFunction: dailyBalancesStats },
  ];

  dispatch({ type: GETMYTICKETSSTATS_ATTEMPT });
  return Promise.all(startupStats.map(s => dispatch(generateStat(s))))
    .then(([ voteTime, dailyBalances ]) => {
      dispatch({ voteTime, dailyBalances, type: GETMYTICKETSSTATS_SUCCESS });
    })
    .catch(error => {
      console.error("getMyTicketsStats errored", error);
      dispatch({ error, type: GETMYTICKETSSTATS_FAILED });
    });
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

  dispatch(calcFunction({ ...opts, startFunction, progressFunction, endFunction, errorFunction }));
});

export const EXPORT_STARTED = "EXPORT_STARTED";
export const EXPORT_COMPLETED = "EXPORT_COMPLETED";
export const EXPORT_ERROR = "EXPORT_ERROR";

export const exportStatToCSV = (opts) => (dispatch, getState) => {
  const { calcFunction, csvFilename } = opts;

  var fd;
  var allSeries;
  var seriesOpts;

  // constants (may be overridden/parametrized in the future)
  const unitDivisor = sel.unitDivisor(getState());
  const timezone = sel.timezone(getState());
  const vsep = ","; // value separator
  const ln = "\n";  // line separator
  const precision = Math.ceil(Math.log10(unitDivisor)); // maximum decimal precision

  // formatting functions
  const quote = (v) => "\"" + v.replace("\"", "\\\"") + "\"";
  const formatTime = v => v ? formatLocalISODate(v, timezone) : "";
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
  const tsDate = sel.tsDate(getState());
  const txDataCb = (mined) => {
    mined.forEach(tx => progressFunction(tsDate(tx.timestamp), formatTx(tx)));
  };

  wallet.streamGetTransactions(walletService, 0, currentBlockHeight, 0, txDataCb)
    .then(endFunction)
    .catch(errorFunction);
};

const recordTicket = (maturingTxs, liveTickets, tx, commitAmount, isWallet, chainParams) => {
  liveTickets[tx.txHash] = { tx, commitAmount, isWallet };
  let ticketMatureHeight = tx.height + chainParams.TicketMaturity;
  maturingTxs[ticketMatureHeight] = maturingTxs[ticketMatureHeight] || [];
  maturingTxs[ticketMatureHeight].push({ tx, amount: commitAmount, isWallet,
    isTicket: true });
};

const recordVoteRevoke = (maturingTxs, tx, amount, isWallet, chainParams) => {
  let matureHeight = tx.height + chainParams.CoinbaseMaturity;
  maturingTxs[matureHeight] = maturingTxs[matureHeight] || [];
  maturingTxs[matureHeight].push({ tx, amount, isWallet, isTicket: false });
};

// return the balance deltas from recorded tickets/votes/revokes that matured
// in the interval fromHeight..toHeight
const findMaturingDeltas = (maturingTxs, fromHeight, toHeight, fromTimestamp, toTimestamp, chainParams, backwards) => {
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
    const maturedThisHeight = {
      spendable: 0, immature: 0, immatureNonWallet: 0, locked: 0,
      lockedNonWallet: 0, voted: 0, revoked: 0, sent: 0, received: 0, ticket: 0,
      stakeRewards: 0, stakeFees: 0, totalStake: 0, timestamp: timestamp, tx: null
    };
    maturingTxs[h].forEach(({ tx, amount, isWallet, isTicket }) => {
      maturedThisHeight.spendable += !isTicket ? amount*inc : 0; // isTicket == false means vote, revoke, coinbase
      maturedThisHeight.immature += isWallet ? -amount*inc : 0;
      maturedThisHeight.immatureNonWallet +=  isWallet ? 0 : -amount*inc;
      maturedThisHeight.locked += isWallet && isTicket ? amount*inc : 0;
      maturedThisHeight.lockedNonWallet += !isWallet && isTicket ? amount*inc : 0;
      maturedThisHeight.tx = tx;
    });

    res.push(maturedThisHeight);
  }
  return res;
};

// closure that calcs ticket info necessary to correctly account for its delta
// to balances, given a ticket tx
const ticketInfo = tx => {
  const debits = tx.tx.getDebitsList();
  // changes in an sstx are the even-numbered, > 0 txouts
  const isTicketChange = (c) => (c.getIndex() > 0) && (c.getIndex() % 2) === 0;
  const change = tx.tx.getCreditsList().reduce((s, c) => s + isTicketChange(c) ? c.getAmount() : 0, 0);
  // a ticket "belongs" to the wallet when the wallet has the private key
  // that can be used to vote/revoke the ticket (ie: if the wallet considers the
  // txout with index === 0 a credit).
  const isWalletTicket = (tx) => (tx.getCreditsList().length > 0) && (tx.getCreditsList()[0].getIndex() === 0);
  const isWallet = isWalletTicket(tx.tx);
  const debitsSum = debits.reduce((s, d) => s + d.getPreviousAmount(), 0);

  // pool fee exists and needs to be accounted for when there are more than
  // two debits and the index of the first one is zero
  const poolFee = (debits.length > 1) && (debits[0].getIndex() === 0)
    ? debits[0].getPreviousAmount() : 0;

  // commit amount is deduced by seeing subtracting everything the wallet
  // spent from what it got back. Ideally, this would be gotten by decoding
  // appropriate stake commitment output. This is specially true if, in the
  // future, consensus rules change to break the requirement that
  // amount_in[x] == commitment_amount[x].
  const commitAmount = debitsSum - change - (isWallet ? tx.tx.getFee() : 0) - poolFee;
  const spentAmount = commitAmount + (isWallet ? tx.fee : 0) + poolFee;
  const purchaseFees = debitsSum - commitAmount;
  return { isWallet, commitAmount, spentAmount, purchaseFees, poolFee };
};

// closure that cals vote/revoke info necessary to correctly account for its
// delta to balances, given a vote/revoke tx
const voteRevokeInfo = async (tx, liveTickets, walletService) => {
  const isVote = tx.txType === wallet.TRANSACTION_TYPE_VOTE;

  const decodedSpender = await wallet.decodeTransactionLocal(tx.tx.getTransaction());
  const spenderInputs = decodedSpender.inputs;
  const ticketHash = reverseRawHash(spenderInputs[spenderInputs.length-1].prevTxId);

  let ticket = liveTickets[ticketHash];
  if (!ticket) {
    let ticketTx;
    try{
      ticketTx = await wallet.getTransaction(walletService, ticketHash);
      if (!ticketTx) {
        // shouldn't really happen on new wallets, given that getTransaction
        // throws an error when the ticket is not found
        throw "Previous live ticket not found: " + ticketHash;
      }
      ticket = ticketInfo(ticketTx);
    } catch (error) {
      if (error.code === 5) { // 5 === grpc/codes.NotFound
        // we may not have the ticket transaction if this wallet only recorded
        // the vote/revocation (eg: pool fee wallet). In this case, we consider
        // that the ticket wasn't ours and zero all applicable values.
        ticket = { isWallet: false, commitAmount: 0, spentAmount: 0,
          purchaseFees: 0, poolFee: 0 };
      } else {
        throw error;
      }
    }
  }
  const ticketCommitAmount = ticket.commitAmount;
  const returnAmount = tx.tx.getCreditsList().reduce((s, c) => s + c.getAmount(), 0);
  const stakeResult = returnAmount - ticketCommitAmount;
  return { wasWallet: ticket.isWallet, isVote, returnAmount, stakeResult, ticketCommitAmount };
};

// closure that calcs how much each tx affects each balance type.
// Ticket and vote/revoke delta calculation assumes *a lot* about how tickets
// are encoded (1st txout === ticket, odds are commitments, etc). If consensus
// rules change the "shape" of a ticket tx in the future, this will need to be
// heavily revised.
const txBalancesDelta = async (tx, maturingTxs, liveTickets, walletService, chainParams) => {
  // tx.amount is negative in sends/tickets/transfers already
  let delta = null;
  switch (tx.txType) {
  case wallet.TRANSACTION_TYPE_TICKET_PURCHASE:
    var { isWallet, commitAmount, spentAmount, purchaseFees } = ticketInfo(tx);
    recordTicket(maturingTxs, liveTickets, tx, commitAmount, isWallet, chainParams);
    delta = { spendable: -spentAmount, immature: isWallet ? commitAmount : 0,
      immatureNonWallet: isWallet ? 0 : commitAmount, voted: 0, revoked: 0,
      sent: 0, received: 0, ticket: commitAmount, locked: 0, lockedNonWallet: 0,
      stakeRewards: 0, stakeFees: purchaseFees, totalStake: spentAmount,
      timestamp: tx.timestamp, tx };
    break;
  case wallet.TRANSACTION_TYPE_VOTE:
  case wallet.TRANSACTION_TYPE_REVOCATION:
    var { wasWallet, isVote, returnAmount, stakeResult,
      ticketCommitAmount } = await voteRevokeInfo(tx, liveTickets, walletService);
    recordVoteRevoke(maturingTxs, tx, returnAmount, wasWallet, chainParams);
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

  return delta;
};

// account for this delta in the balances and call the progress function
const addDelta = (delta, progressFunction, currentBalance, tsDate) => {
  progressFunction(tsDate(delta.timestamp), currentBalance);

  let balance = {
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
  balance.total = currentBalance.spendable + currentBalance.locked +
    currentBalance.immature;

  return balance;
};

// Closure to process transactions backwards. This is slightly tricky as
// going backwards, when we process transaction X, the current balance may be
// affect by this or earlier transaction's immature balances. So we process
// the txs by collecting the maturing transactions that might affect tx `i`,
// processing them first, then processing tx i.
const txDataCbBackwards = async ({ mined, maturingTxs, liveTickets,
  walletService, chainParams, progressFunction, currentBlockHeight, balances, tsDate, maxMaturity, currentBalance }) => {
  let now = new Date();
  let toAddDeltas = {};
  let lastTxHeight = currentBlockHeight;
  let lastTxTimestamp = now.getTime() / 1000;
  const fields = [ "spendable", "locked", "stakeFees", "stakeRewards", "totalStake", "immature" ];
  const turnFieldsNegative = (delta) => fields.forEach(f => delta[f] = -delta[f]);

  currentBalance = balances.reduce((cb, acct) => {
    cb.spendable += acct.spendable;
    cb.immature += acct.immatureStakeGeneration + acct.immatureReward;
    cb.locked += acct.lockedByTickets;
    return cb;
  }, currentBalance);

  for (let i = 0; i < mined.length; i++) {
    const tx = mined[i];
    const delta = toAddDeltas[i] ? toAddDeltas[i] : await txBalancesDelta(tx, maturingTxs, liveTickets, walletService, chainParams);
    turnFieldsNegative(delta);

    let j = i+1;
    while ((j < mined.length) && (mined[j].height >= tx.height - maxMaturity)) {
      // this tx might influence the balance of tx[i]. So calculate its delta,
      // which will fill `maturingTxs` as needed
      if (!toAddDeltas[j]) {
        toAddDeltas[j] = await txBalancesDelta(mined[j], maturingTxs, liveTickets, walletService, chainParams);
      }
      j++;
    }
    turnFieldsNegative(toAddDeltas);

    const maturedDeltas = findMaturingDeltas(maturingTxs, tx.height+1, lastTxHeight,
      tx.timestamp, lastTxTimestamp, chainParams, true);
    maturedDeltas.forEach((delta) => {
      currentBalance = addDelta(delta, progressFunction, { ...currentBalance, delta }, tsDate);
    });
    currentBalance = addDelta(delta, progressFunction, { ...currentBalance, delta }, tsDate);

    lastTxHeight = tx.height;
    lastTxTimestamp = delta.timestamp;
  }
};

const txDataCb = async ({ mined, maturingTxs, liveTickets, currentBalance, tsDate, progressFunction, chainParams, walletService, recentBlockTimestamp, currentBlockHeight }) => {
  let lastTxHeight = 0;
  let lastTxTimestamp = chainParams.GenesisTimestamp;
  for (let i = 0; i < mined.length; i++) {
    const tx = mined[i];
    const maturedDeltas = findMaturingDeltas(maturingTxs, lastTxHeight+1, tx.height,
      lastTxTimestamp, tx.timestamp, chainParams);
    maturedDeltas.forEach((delta) => {
      currentBalance = addDelta(delta, progressFunction, currentBalance, tsDate);
    });

    const delta = await txBalancesDelta(tx, maturingTxs, liveTickets, walletService, chainParams);
    currentBalance = addDelta(delta, progressFunction, currentBalance, tsDate);

    lastTxHeight = tx.height;
    lastTxTimestamp = delta.timestamp;
  }

  // check for remaining tickets that may have matured
  const maturedDeltas = findMaturingDeltas(maturingTxs, lastTxHeight+1, currentBlockHeight,
    lastTxTimestamp, recentBlockTimestamp || Date.now(), chainParams);
  maturedDeltas.forEach( delta => {
    currentBalance = addDelta(delta, progressFunction, currentBalance, tsDate);
  });
};

const prepDataToCalcStats = async (startBlock, endBlock, currentDate, endDate, pageDir, data) => {
  let continueGetting = true;
  let currentBlock = startBlock;
  const toProcess = [];
  const { maxMaturity, currentBlockHeight, pageSize, tsDate, walletService,
    backwards } = data;

  // grab transactions in batches of (roughly) `pageSize` transactions, so
  // that if we can stop in the middle of the process (say, because we're
  // interested in only the first 10 days worth of balances)
  while (continueGetting) {
    const { mined } = await wallet.getTransactions(walletService, currentBlock,
      endBlock, pageSize);
    if (mined.length > 0) {
      const lastTx = mined[mined.length-1];
      currentBlock = lastTx.height + pageDir;
      currentDate = tsDate(lastTx.timestamp);
      toProcess.push(...mined);
    }
    continueGetting =
      (mined.length > 0) &&
      (currentBlock > 0) &&
      (currentBlock < currentBlockHeight) &&
      (
        (!endDate) ||
        (endDate && !backwards && currentDate < endDate) ||
        (endDate && backwards && currentDate > endDate )
      ) ;
  }

  // grab all txs that are ticket/coinbase maturity blocks from the last tx
  // so that we can account for tickets and votes maturing
  endBlock = currentBlock + maxMaturity * pageDir;
  if ((currentBlock > 0) && (currentBlock < currentBlockHeight)) {
    const { mined } = await wallet.getTransactions(walletService, currentBlock,
      endBlock, 0);
    if (mined && mined.length > 0) {
      toProcess.push(...mined);
    }
  }

  return toProcess;
};

export const balancesStats = (opts) => async (dispatch, getState) => {
  const { progressFunction, startFunction, endFunction, errorFunction, endDate, backwards } = opts;

  const { currentBlockHeight, walletService,
    recentBlockTimestamp, balances } = getState().grpc;

  const chainParams = sel.chainParams(getState());

  let liveTickets = {}; // live by hash
  let maturingTxs = {}; // maturing by height

  // running balance totals
  let currentBalance = { spendable: 0, immature: 0, immatureNonWallet: 0,
    locked: 0, lockedNonWallet: 0, total: 0, stakeRewards: 0, stakeFees: 0,
    totalStake: 0, delta: { voted: 0, revoked: 0, ticket: 0, sent: 0, received: 0 } };

  const tsDate = sel.tsDate(getState());

  const pageSize = 200;
  const maxMaturity = Math.max(chainParams.CoinbaseMaturity, chainParams.TicketMaturity);
  let currentDate = new Date();
  let toProcess = [];
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

  try {
    const data = { maxMaturity, currentBlockHeight, pageSize, tsDate, walletService,
      backwards };
    if (backwards) {
      toProcess = await prepDataToCalcStats(currentBlockHeight, 1, currentDate, endDate, -1, data);
      // when calculating backwards, we need to account for unmined txs, because
      // the account balances for locked tickets include them. To simplify the
      // logic, we modify the unmined transactions to simulate as if it had been
      // just mined in the last block.
      const { unmined } = await wallet.getTransactions(walletService, -1, -1, 0);
      const fixedUnmined = unmined.map(tx => ({ ...tx, timestamp: currentDate.getTime(),
        height: currentBlockHeight }));
      toProcess.unshift(...fixedUnmined);

      // on backwards stats, we find vote txs before finding ticket txs, so
      // pre-process tickets from all grabbed txs to avoid making the separate
      // getTransaction calls in voteRevokeInfo()
      toProcess.forEach(tx => {
        if (tx.txType == wallet.TRANSACTION_TYPE_TICKET_PURCHASE) {
          var { isWallet, commitAmount } = ticketInfo(tx);
          recordTicket(maturingTxs, liveTickets, tx, commitAmount, isWallet, chainParams);
        }
      });

      await txDataCbBackwards({ mined: toProcess, maturingTxs, liveTickets, walletService, currentBalance,
        chainParams, currentBlockHeight, tsDate, progressFunction, recentBlockTimestamp, balances, maxMaturity });
      return endFunction();
    }

    toProcess = await prepDataToCalcStats(1, currentBlockHeight, currentDate, endDate, 1, data);
    await txDataCb({ mined: toProcess, maturingTxs, liveTickets, walletService,
      chainParams, currentBlockHeight, currentBalance, tsDate, progressFunction, recentBlockTimestamp });
    endFunction();
  } catch (err) {
    errorFunction(err);
  }
};

export const dailyBalancesStats = (opts) => {
  const { progressFunction, endFunction, startFunction, backwards } = opts;

  let lastDate = null;
  let balance = { spendable: 0, locked: 0, total: 0, sent: 0, received: 0,
    voted: 0, revoked: 0, ticket: 0 };

  const aggStartFunction = (opts) => {
    startFunction({
      series : [
        ...opts.series,
        { name: "sent", type: VALUE_TYPE_ATOMAMOUNT },
        { name: "received", type: VALUE_TYPE_ATOMAMOUNT },
        { name: "voted", type: VALUE_TYPE_ATOMAMOUNT },
        { name: "revoked", type: VALUE_TYPE_ATOMAMOUNT },
        { name: "ticket", type: VALUE_TYPE_ATOMAMOUNT },
      ]
    });
  };

  const aggProgressFunction = (time, series) => {
    if (!isSameDate(time, lastDate)) {
      if (lastDate) {
        progressFunction(endOfDay(lastDate), balance);
      }
      const { delta } = series;
      balance = { ...series, sent: delta.sent, received: delta.received,
        voted: delta.voted, revoked: delta.revoked, ticket: delta.ticket };
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    } else {
      const { delta } = series;
      const balanceSeries = backwards ? balance : series;
      balance = {
        ...balanceSeries,
        sent: balance.sent + delta.sent,
        received: balance.received + delta.received,
        voted: balance.voted + delta.voted,
        revoked: balance.revoked + delta.revoked,
        ticket: balance.ticket + delta.ticket,
      };
    }
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
      const tsDate = sel.tsDate(getState());
      progressFunction(tsDate(ticket.enterTimestamp), {
        spenderTimestamp: ticket.leaveTimestamp ? tsDate(ticket.leaveTimestamp) : null,
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
