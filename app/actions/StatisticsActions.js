import * as wallet from "wallet";
import * as sel from "selectors";
import fs from "fs";
import { isNumber, isNullOrUndefined, isUndefined } from "util";
import { tsToDate, endOfDay } from "helpers";

const VALUE_TYPE_ATOMAMOUNT = "VALUE_TYPE_ATOMAMOUNT";

export const EXPORT_STARTED = "EXPORT_STARTED";
export const EXPORT_COMPLETED = "EXPORT_COMPLETED";
export const EXPORT_ERROR = "EXPORT_ERROR";

export const exportStatToCSV = (opts) => (dispatch) => {
  // TODO: get from dialog
  const csvFilename = "test.csv";
  dispatch(exportStatToCSVFile({...opts, csvFilename}));
};

export const exportStatToCSVFile = (opts) => (dispatch, getState) => {
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

  const { currentBlockHeight, walletService } = getState().grpc;

  startFunction({
    series: [
      {name: "spendable", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "locked", type: VALUE_TYPE_ATOMAMOUNT},
      {name: "total", type: VALUE_TYPE_ATOMAMOUNT},
    ],
  });

  // closure that calcs how much each tx affects each balance type
  const txBalancesDelta = (tx) => {
    // tx.amount is negative in sends/tickets/transfers already
    switch (tx.txType) {
    case wallet.TRANSACTION_TYPE_TICKET_PURCHASE:
      var commitAmount = tx.tx.getCreditsList().reduce((s, c) => s + c.getInternal() ? 0 : c.getAmount(), 0);
      return {spendable: tx.amount - commitAmount, locked: commitAmount};
    case wallet.TRANSACTION_TYPE_VOTE:
    case wallet.TRANSACTION_TYPE_REVOCATION:
      // FIXME: this is going to break the calc if/when we have split tickets, since
      // then the commitment amount on TICKET_PURCHASE will be !== than the ticketPrice
      var ticketPrice = tx.tx.getDebitsList().reduce((s, c) => s + c.getPreviousAmount(), 0);
      return {spendable: tx.amount + ticketPrice, locked: -ticketPrice};
    case wallet.TRANSACTION_TYPE_COINBASE:
    case wallet.TRANSACTION_TYPE_REGULAR:
      return {spendable: +tx.amount, locked: 0};
    default: throw "Unknown tx type: " + tx.txType;
    }
  };

  let currentBalance = {spendable: 0, locked: 0, total: 0};

  const txDataCb = (mined) => {
    mined.forEach(tx => {
      const delta = txBalancesDelta(tx);
      currentBalance = {
        spendable: currentBalance.spendable + delta.spendable,
        locked: currentBalance.locked + delta.locked
      };
      currentBalance.total = currentBalance.spendable + currentBalance.locked;
      progressFunction(tsToDate(mined[0].timestamp), currentBalance);
    });
  };

  wallet.streamGetTransactions(walletService, 0, currentBlockHeight, 0, txDataCb)
    .then(endFunction)
    .catch(errorFunction);
};

export const dailyBalancesStats = (opts) => {
  const { progressFunction, endFunction } = opts;

  let lastDate = null;
  let balance = {spendable: 0, locked: 0, total: 0};

  const differentDays = (d1, d2) =>
    (d1.getYear() !== d2.getYear()) ||
    (d1.getMonth() !== d2.getMonth()) ||
    (d1.getDate() !== d2.getDate());

  const aggProgressFunction = (time, series) => {
    if (!lastDate) {
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    } else if (differentDays(time, lastDate)) {
      progressFunction(endOfDay(lastDate), balance);
      lastDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    }
    balance = {...series};
  };

  const aggEndFunction = () => {
    progressFunction(endOfDay(lastDate), balance);
    endFunction();
  };

  return balancesStats({...opts, progressFunction: aggProgressFunction,
    endFunction: aggEndFunction});
};
