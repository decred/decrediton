import * as wallet from "wallet";
import * as sel from "selectors";
import { compose } from "fp";
import fs from "fs";
import { isString, isNumber, isNullOrUndefined, isUndefined } from "util";
import { tsToDate } from "helpers";

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
  const vsep = ","; // value separator
  const ln = "\n";  // line separator
  const precision = 8; // maximum decimal precision

  // formatting functions
  const quote = (v) => "\"" + v.replace("\"", "\\\"") + "\"";
  const formatTime = t => t.toISOString();
  const csvValue = (v) => isNullOrUndefined(v) ? "" : isNumber(v) ? v.toFixed(precision) : quote(v);
  const csvLine = (values) => values.map(csvValue).join(vsep);

  // called once at the start of the stats calc function
  const startFunction = (opts) => {
    console.log("starting", opts);
    allSeries = opts.series;
    const seriesNames = allSeries.map(s => s.name);
    const headerLine = csvLine(["time", ...seriesNames]);

    fd = fs.openSync(csvFilename, "w", 0o600);
    fs.writeSync(fd, headerLine);
    fs.writeSync(fd, ln);
  };

  // called once for each data line
  const progressFunction = (time, series) => {
    // console.log("Progress", time, series);
    const values = allSeries.map(s => !isUndefined(series[s.name]) ? series[s.name] : null);
    values.unshift(formatTime(time));
    const line = csvLine(values);
    fs.writeSync(fd, line);
    fs.writeSync(fd, ln);
  };

  // called once at the end
  const endFunction = () => {
    console.log("ending");
    fs.closeSync(fd);
    fd = null;
  };

  dispatch(calcFunction({opts, startFunction, progressFunction, endFunction}));

  // if (fd !== null) {
  //   fs.closeSync(fd);
  // }
};

export const transactionStats = (opts) => (dispatch, getState) => {
  const { progressFunction, startFunction, endFunction } = opts;

  const { currentBlockHeight, walletService } = getState().grpc;

  startFunction({
    series: [
      {name: "hash"},
      {name: "type"},
      {name: "direction"},
      {name: "fee"},
      {name: "amount"},
      {name: "credits"},
      {name: "debits"},
    ],
  });

  const scaleAmount = amount => amount / 1e8;

  const formatTx = (tx) => {
    // console.log(tx);
    return {
      hash: tx.txHash,
      type: wallet.TRANSACTION_TYPES[tx.type],
      direction: tx.direction,
      fee: scaleAmount(tx.fee),
      amount: scaleAmount(tx.amount),
      credits: scaleAmount(tx.tx.getCreditsList().reduce((s, c) => s + c.getAmount(), 0)),
      debits: scaleAmount(tx.tx.getDebitsList().reduce((s, d) => s + d.getPreviousAmount(), 0)),
    };
  };

  const txDataCb = (mined) => {
    //console.log(mined);
    mined.forEach(tx => progressFunction(tsToDate(tx.timestamp), formatTx(tx)));
  };

  wallet.streamGetTransactions(walletService, 0, currentBlockHeight, 0, txDataCb)
    .then(endFunction);
};
