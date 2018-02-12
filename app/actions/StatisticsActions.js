import * as wallet from "wallet";
import * as sel from "selectors";
import fs from "fs";
import { isNumber, isNullOrUndefined, isUndefined } from "util";
import { tsToDate, endOfDay, reverseRawHash } from "helpers";

const VALUE_TYPE_ATOMAMOUNT = "VALUE_TYPE_ATOMAMOUNT";

const GETSTARTUPSTATS_ATTEMPT = "GETSTARTUPSTATS_ATTEMPT";
const GETSTARTUPSTATS_SUCCESS = "GETSTARTUPSTATS_SUCCESS";
const GETSTARTUPSTATS_FAILED = "GETSTARTUPSTATS_FAILED";

// Calculates all startup statistics
export const getStartupStats = () => (dispatch) => {

  const startupStats = [
    {calcFunction: dailyBalancesStats},
  ];

  dispatch({type: GETSTARTUPSTATS_ATTEMPT});
  Promise.all(startupStats.map(s => dispatch(generateStat(s))))
    .then(([dailyBalances]) => {
      dispatch({dailyBalances, type: GETSTARTUPSTATS_SUCCESS});
    })
    .catch(error => dispatch({error, type: GETSTARTUPSTATS_FAILED}));
};

// generateStat starts generating the statistic as defined on the opts. It
// returns a promise that gets resolved with all the data in-memory after the
// stat has been completely calculated.
export const generateStat = (opts) => (dispatch) => new Promise((resolve, reject) => {

  const { calcFunction } = opts;

  const stat = { series: null, data: [], };
  const startFunction = ({series}) => stat.series = series;
  const endFunction = () => resolve(stat);
  const errorFunction = error => reject(error);
  const progressFunction = (time, series) => {
    stat.data.push({time, series});
  };

  dispatch(calcFunction({opts, startFunction, progressFunction, endFunction, errorFunction}));
});

export const EXPORT_STARTED = "EXPORT_STARTED";
export const EXPORT_COMPLETED = "EXPORT_COMPLETED";
export const EXPORT_ERROR = "EXPORT_ERROR";

export const exportStatToCSV = (opts) => (dispatch, getState) => {
  const { calcFunction, csvFilename } = opts;

  var fd;
  var allSeries;

  // constants (may be overriden/parametrized in the future)
  const unitDivisor = sel.unitDivisor(getState());
  const vsep = ","; // value separator
  const ln = "\n";  // line separator
  const precision = Math.ceil(Math.log10(unitDivisor)); // maximum decimal precision

  // formatting functions
  const quote = (v) => "\"" + v.replace("\"", "\\\"") + "\"";
  const formatTime = t => t.toISOString();
  const csvValue = (v) => isNullOrUndefined(v) ? "" : isNumber(v) ? v.toFixed(precision) : quote(v);
  const csvLine = (values) => values.map(csvValue).join(vsep);

  const seriesValueFormatFunc = (series) => {
    if (series["type"] === VALUE_TYPE_ATOMAMOUNT) {
      return v => v / unitDivisor;
    } else {
      return v => v;
    }
  };

  // called once at the start of the stats calc function
  const startFunction = (opts) => {
    dispatch({type: EXPORT_STARTED});
    allSeries = opts.series.map(s => ({...s, valueFormatFunc: seriesValueFormatFunc(s)}));
    const seriesNames = allSeries.map(s => s.name);
    const headerLine = csvLine(["time", ...seriesNames]);

    fd = fs.openSync(csvFilename, "w", 0o600);
    fs.writeSync(fd, headerLine);
    fs.writeSync(fd, ln);
  };

  // called once for each data line
  const progressFunction = (time, series) => {
    // console.log("Progress", time, series);
    const values = allSeries.map(s => !isUndefined(series[s.name])
      ? s.valueFormatFunc(series[s.name])
      : null);
    values.unshift(formatTime(time));
    const line = csvLine(values);
    fs.writeSync(fd, line);
    fs.writeSync(fd, ln);
  };

  const errorFunction = (error) => {
    dispatch({error, type: EXPORT_ERROR});
    if (fd) {
      fs.closeSync(fd);
      fd = null;
    }
  };

  // called once at the end
  const endFunction = () => {
    dispatch({filename: csvFilename, type: EXPORT_COMPLETED});
    if (fd) {
      fs.closeSync(fd);
      fd = null;
    }
  };

  dispatch(calcFunction({opts, startFunction, progressFunction, endFunction, errorFunction}));

  // if (fd !== null) {
  //   fs.closeSync(fd);
  // }
};

export const transactionStats = (opts) => (dispatch, getState) => {
  const { progressFunction, startFunction, endFunction, errorFunction } = opts;

  const { currentBlockHeight, walletService } = getState().grpc;

  startFunction({
    series: [
      {name: "hash"},
      {name: "type"},
      {name: "direction"},
      {name: "fee", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "amount", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "credits", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "debits", type: VALUE_TYPE_ATOMAMOUNT},
    ],
  });

  const formatTx = (tx) => {
    // console.log(tx);
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
    //console.log(mined);
    mined.forEach(tx => progressFunction(tsToDate(tx.timestamp), formatTx(tx)));
  };

  wallet.streamGetTransactions(walletService, 0, currentBlockHeight, 0, txDataCb)
    .then(endFunction)
    .catch(errorFunction);
};

export const balancesStats = (opts) => (dispatch, getState) => {
  const { progressFunction, startFunction, endFunction, errorFunction } = opts;

  const { currentBlockHeight, walletService, decodeMessageService } = getState().grpc;

  startFunction({
    series: [
      {name: "spendable", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "locked", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "total", type: VALUE_TYPE_ATOMAMOUNT},
    ],
  });

  let liveTickets = {};

  // closure that calcs how much each tx affects each balance type
  const txBalancesDelta = async (tx) => {
    // tx.amount is negative in sends/tickets/transfers already
    switch (tx.txType) {
    case wallet.TRANSACTION_TYPE_TICKET_PURCHASE:
      var change = tx.tx.getCreditsList().reduce((s, c) => s + c.getInternal() ? c.getAmount() : 0, 0);
      var commitAmount = tx.tx.getDebitsList().reduce((s, d) => s + d.getPreviousAmount(), 0) - change;
      liveTickets[tx.txHash] = {tx, commitAmount};
      return {spendable: -commitAmount, locked: commitAmount, tx};
    case wallet.TRANSACTION_TYPE_VOTE:
    case wallet.TRANSACTION_TYPE_REVOCATION:
      var decodedSpender = await wallet.decodeTransaction(decodeMessageService, tx.tx.getTransaction());
      var spenderInputs = decodedSpender.getTransaction().getInputsList();
      var ticketHash = reverseRawHash(spenderInputs[spenderInputs.length-1].getPreviousTransactionHash());
      var ticket = liveTickets[ticketHash];
      if (!ticket) throw "Previous live ticket not found: " + ticketHash;
      var returnAmount = tx.tx.getCreditsList().reduce((s, c) => s + c.getAmount(), 0);
      return {spendable: +returnAmount, locked: -ticket.commitAmount, tx};
    case wallet.TRANSACTION_TYPE_COINBASE:
    case wallet.TRANSACTION_TYPE_REGULAR:
      return {spendable: +tx.amount, locked: 0, tx};
    default: throw "Unknown tx type: " + tx.txType;
    }
  };

  let currentBalance = {spendable: 0, locked: 0, total: 0, tx: null};

  const txDataCb = async ({mined}) => {
    for (let i = 0; i < mined.length; i++) {
      const tx = mined[i];
      const delta = await txBalancesDelta(tx);
      currentBalance = {
        spendable: currentBalance.spendable + delta.spendable,
        locked: currentBalance.locked + delta.locked,
        tx: delta.tx,
      };
      currentBalance.total = currentBalance.spendable + currentBalance.locked;
      progressFunction(tsToDate(tx.timestamp), currentBalance);
    }
    endFunction();
  };

  wallet.getTransactions(walletService, 0, currentBlockHeight)
    .then(txDataCb)
    .catch(errorFunction);
};

export const dailyBalancesStats = (opts) => {
  const { progressFunction, endFunction, startFunction } = opts;

  let lastDate = null;
  let balance = {spendable: 0, locked: 0, total: 0, sent: 0, received: 0};

  const differentDays = (d1, d2) =>
    (d1.getYear() !== d2.getYear()) ||
    (d1.getMonth() !== d2.getMonth()) ||
    (d1.getDate() !== d2.getDate());

  const aggStartFunction = (opts) => {
    opts.series = [...opts.series,
      {name: "sent", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "received", type: VALUE_TYPE_ATOMAMOUNT},
    ];
    startFunction(opts);
  };

  const aggProgressFunction = (time, series) => {
    if (!lastDate) {
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    } else if (differentDays(time, lastDate)) {
      progressFunction(endOfDay(lastDate), balance);
      balance = {...balance, sent: 0, received: 0};
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    }
    const { tx } = series;
    balance = {
      ...series,
      sent: balance.sent + (tx.amount < 0 ? -tx.amount : 0),
      received: balance.received + (tx.amount > 0 ? tx.amount : 0),
    };
  };

  const aggEndFunction = () => {
    progressFunction(endOfDay(lastDate), balance);
    endFunction();
  };

  return balancesStats({...opts, progressFunction: aggProgressFunction,
    endFunction: aggEndFunction, startFunction: aggStartFunction});
};
