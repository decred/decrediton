import os from "os";
import fs from "fs";
import * as l from "../../../app/main_dev/logging.js";
import * as p from "../../../app/main_dev/paths";
import { isEqual } from "lodash";

const logging = l;
const paths = p;

jest.mock("fs");

const testLogMsg = "test-log-msg";
const testAppDataDir = "test-app-data-dir";
const testDataMsg = "panic test-data" + os.EOL;
const testDataMsg2 = "[ERR] test-data2" + os.EOL;
const testDataMsg3 = "goroutine test-data3" + os.EOL;
const testData = Buffer.from(testDataMsg);
const testData2 = Buffer.from(testDataMsg2);
const testData3 = Buffer.from(testDataMsg3);

let mockGetAppDataDirectory;
let mockCreateWriteStream;
let mockCreateWriteStreamOn;
let mockCreateWriteStreamWrite;
let mockCreateWriteStreamOnce;
let mockCreateWriteStreamEnd;
let mockIOWrite;
beforeEach(() => {
  mockCreateWriteStream = fs.createWriteStream = jest.fn(() => ({
    on: mockCreateWriteStreamOn,
    write: mockCreateWriteStreamWrite,
    once: mockCreateWriteStreamOnce,
    end: mockCreateWriteStreamEnd
  }));
  mockGetAppDataDirectory = paths.getAppDataDirectory = jest.fn(
    () => testAppDataDir
  );
  mockCreateWriteStreamOn = jest.fn(() => ({}));
  mockCreateWriteStreamWrite = jest.fn(() => true);
  mockCreateWriteStreamOnce = jest.fn(() => {});
  mockCreateWriteStreamEnd = jest.fn(() => {});

  mockIOWrite = jest.fn(() => {});
});

test("test logging in debug mode", () => {
  const onCbs = {};
  mockCreateWriteStreamOn = jest.fn((name, cb) => {
    onCbs[name] = cb;
  });
  const mockConsoleLog = jest.fn((msg) => {
    console.info(msg);
  });
  jest.spyOn(console, "log").mockImplementation(mockConsoleLog);

  const logger = new logging.Logger(true); // doesn't use createLogger to enable async testing

  /* error */
  logger.log("error", testLogMsg);

  expect(mockGetAppDataDirectory).toHaveBeenCalled();
  expect(mockCreateWriteStream).toHaveBeenLastCalledWith(
    `${testAppDataDir}/decrediton.log`
  );
  let expectdLogRegExp = new RegExp(`ERR] DCTN: ${testLogMsg}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );

  /* warning */
  logger.log("warn", testLogMsg + "-warn");
  expectdLogRegExp = new RegExp(`WRN] DCTN: ${testLogMsg + "-warn"}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );

  /* info */
  logger.log("info", testLogMsg + "-info");
  expectdLogRegExp = new RegExp(`INF] DCTN: ${testLogMsg + "-info"}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );

  /* verbose */
  mockCreateWriteStreamWrite.mockClear();
  logger.log("verbose", testLogMsg + "-verbose");
  expectdLogRegExp = new RegExp(`VBS] DCTN: ${testLogMsg + "-verbose"}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).not.toHaveBeenCalled();

  /* debug */
  mockCreateWriteStreamWrite.mockClear();
  logger.log("debug", testLogMsg + "-debug");
  expectdLogRegExp = new RegExp(`DBG] DCTN: ${testLogMsg + "-debug"}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).not.toHaveBeenCalled();

  /* silly */
  mockCreateWriteStreamWrite.mockClear();
  logger.log("silly", testLogMsg + "-silly");
  expectdLogRegExp = new RegExp(`TRC] DCTN: ${testLogMsg + "-silly"}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).not.toHaveBeenCalled();

  /* there is nothing in the buffer */
  mockConsoleLog.mockClear();
  mockCreateWriteStreamWrite.mockClear();
  onCbs["drain"].call();
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockCreateWriteStreamWrite).not.toHaveBeenCalled();

  /* end */
  logger.close();
  expect(mockCreateWriteStreamEnd).toHaveBeenCalled();
  expect(mockCreateWriteStreamOnce).toHaveBeenCalled();
});

test("test logging in non debug mode - log file is busy", () => {
  const onCbs = {};
  let drainResponse = false;
  mockCreateWriteStreamOn = jest.fn((name, cb) => {
    onCbs[name] = cb;
  });
  const mockConsoleLog = jest.fn((msg) => {
    console.info(msg);
  });
  jest.spyOn(console, "log").mockImplementation(mockConsoleLog);
  mockCreateWriteStreamWrite = jest.fn(() => drainResponse);

  const logger = new logging.Logger(false); // doesn't use createLogger to enable async testing

  /* error */
  logger.log("error", testLogMsg);

  expect(mockGetAppDataDirectory).toHaveBeenCalled();
  expect(mockCreateWriteStream).toHaveBeenLastCalledWith(
    `${testAppDataDir}/decrediton.log`
  );
  expect(mockCreateWriteStreamWrite).toHaveBeenCalled();
  mockCreateWriteStreamWrite.mockClear();

  /* log file has been drained */

  /* error again */
  logger.log("error", testLogMsg + "-error2");

  /* warning */
  logger.log("warn", testLogMsg + "-warn");

  /* info */
  logger.log("info", testLogMsg + "-info");

  /* verbose */
  logger.log("verbose", testLogMsg + "-verbose");

  /* debug */
  logger.log("debug", testLogMsg + "-debug");

  /* silly */
  logger.log("silly", testLogMsg + "-silly");

  drainResponse = true;
  expect(mockConsoleLog).not.toHaveBeenCalled();
  expect(mockCreateWriteStreamWrite).not.toHaveBeenCalled();
  onCbs["drain"].call();

  /* the second error log write */
  let expectdLogRegExp = new RegExp(`ERR] DCTN: ${testLogMsg}-error2`, "g");
  expect(mockCreateWriteStreamWrite).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(expectdLogRegExp)
  );

  /* warning */
  expectdLogRegExp = new RegExp(`WRN] DCTN: ${testLogMsg + "-warn"}`, "g");
  expect(mockCreateWriteStreamWrite).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(expectdLogRegExp)
  );

  /* info */
  expectdLogRegExp = new RegExp(`INF] DCTN: ${testLogMsg + "-info"}`, "g");
  expect(mockCreateWriteStreamWrite).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(expectdLogRegExp)
  );
});

test("test logging - unknown log level", () => {
  const onCbs = {};
  const drainResponse = false;
  mockCreateWriteStreamOn = jest.fn((name, cb) => {
    onCbs[name] = cb;
  });
  const mockConsoleLog = jest.fn((msg) => {
    console.info(msg);
  });
  jest.spyOn(console, "log").mockImplementation(mockConsoleLog);
  mockCreateWriteStreamWrite = jest.fn(() => drainResponse);

  const logger = new logging.Logger(true);

  logger.log("unknown-loglevel", testLogMsg);

  expect(mockGetAppDataDirectory).toHaveBeenCalled();
  expect(mockCreateWriteStream).toHaveBeenLastCalledWith(
    `${testAppDataDir}/decrediton.log`
  );
  const expectdLogRegExp = new RegExp(`UNK] DCTN: ${testLogMsg}`, "g");
  expect(mockConsoleLog).toHaveBeenLastCalledWith(
    expect.stringMatching(expectdLogRegExp)
  );
  expect(mockCreateWriteStreamWrite).not.toHaveBeenCalled();
});

test("test create logger", () => {
  const logger3 = new logging.Logger(true);
  const logger4 = new logging.Logger(false);
  expect(isEqual(logger3, logger4)).toBeFalsy();

  const logger = logging.createLogger(true);
  const logger2 = logging.createLogger(false);
  expect(isEqual(logger, logger2)).toBeTruthy();
});

test("test AddToDcrdLog", () => {
  const destIO = {
    write: mockIOWrite
  };
  /* in debug mode */
  logging.AddToDcrdLog(destIO, testData, true);
  expect(mockIOWrite).toHaveBeenCalledWith(testData);
  expect(logging.lastLogLine(logging.GetDcrdLogs())).toBe(testDataMsg.trim());
  expect(logging.lastPanicLine(logging.GetDcrdLogs())).toBe(testDataMsg.trim());

  /* in non debug mode */
  mockIOWrite.mockClear();
  logging.AddToDcrdLog(destIO, testData2, false);
  expect(mockIOWrite).not.toHaveBeenCalled();

  expect(logging.GetDcrdLogs()).toStrictEqual(
    Buffer.from(`${testDataMsg}${testDataMsg2}`)
  );
  expect(logging.lastLogLine(logging.GetDcrdLogs())).toBe(testDataMsg2.trim());
  expect(logging.lastErrorLine(logging.GetDcrdLogs())).toBe(
    testDataMsg2.trim()
  );
  expect(logging.lastPanicLine(logging.GetDcrdLogs())).toBe(testDataMsg.trim());

  /* third log */
  mockIOWrite.mockClear();
  logging.AddToDcrdLog(destIO, testData3, false);
  expect(mockIOWrite).not.toHaveBeenCalled();

  expect(logging.GetDcrdLogs()).toStrictEqual(
    Buffer.from(`${testDataMsg}${testDataMsg2}${testDataMsg3}`)
  );
  expect(logging.lastLogLine(logging.GetDcrdLogs())).toBe(testDataMsg3.trim());
  expect(logging.lastErrorLine(logging.GetDcrdLogs())).toBe(
    testDataMsg2.trim()
  );
  expect(logging.lastPanicLine(logging.GetDcrdLogs())).toBe(testDataMsg.trim());
});

test("test AddToDcrwalletLog", () => {
  const destIO = { write: mockIOWrite };
  /* in debug mode */
  logging.AddToDcrwalletLog(destIO, testData3, true);
  expect(mockIOWrite).toHaveBeenCalledWith(testData3);

  /* in non debug mode */
  mockIOWrite.mockClear();
  logging.AddToDcrwalletLog(destIO, testData2, false);
  expect(mockIOWrite).not.toHaveBeenCalled();

  expect(logging.GetDcrwalletLogs()).toStrictEqual(
    Buffer.from(`${testDataMsg3}${testDataMsg2}`)
  );
  expect(logging.lastPanicLine(logging.GetDcrwalletLogs())).toBe(
    testDataMsg3.trim()
  );
  logging.ClearDcrwalletLogs();
  expect(logging.GetDcrwalletLogs()).toStrictEqual(Buffer.from(""));
});

test("test AddToDcrlndLog", () => {
  const destIO = {
    write: mockIOWrite
  };
  /* in debug mode */
  logging.AddToDcrlndLog(destIO, testData, true);
  expect(mockIOWrite).toHaveBeenCalledWith(testData);

  /* in non debug mode */
  mockIOWrite.mockClear();
  logging.AddToDcrlndLog(destIO, testData2, false);
  expect(mockIOWrite).not.toHaveBeenCalled();

  expect(logging.GetDcrlndLogs()).toStrictEqual(
    Buffer.from(`${testDataMsg}${testDataMsg2}`)
  );
});

test("test AddToDexcLog", () => {
  const destIO = {
    write: mockIOWrite
  };
  /* in debug mode */
  logging.AddToDexcLog(destIO, testData, true);
  expect(mockIOWrite).toHaveBeenCalledWith(testData);

  /* in non debug mode */
  mockIOWrite.mockClear();
  logging.AddToDexcLog(destIO, testData2, false);
  expect(mockIOWrite).not.toHaveBeenCalled();

  expect(logging.GetDexcLogs()).toStrictEqual(
    Buffer.from(`${testDataMsg}${testDataMsg2}`)
  );
});

test("test AddToPrivacyLog", () => {
  const destIO = {
    write: mockIOWrite
  };
  const msgs = [
    " Dialed CSPPServer",
    " Mixing output",
    " Completed CoinShuffle++ mix of output",
    " wallet.MixOutput",
    " AccountMixer"
  ];

  /* in debug mode */

  logging.AddToPrivacyLog(destIO, "random not privacy msg", true);
  expect(mockIOWrite).not.toHaveBeenCalled();
  for (let index = 0; index < msgs.length; index++) {
    logging.AddToPrivacyLog(destIO, msgs[index], true);
    expect(mockIOWrite).toHaveBeenCalledWith(msgs[index]);
  }

  expect(logging.getPrivacyLogs()).toStrictEqual(msgs.join(""));

  logging.cleanPrivacyLogs();
  expect(logging.getPrivacyLogs()).toStrictEqual("");
});

test("test CheckDaemonLogs", () => {
  const msgs = [
    " Reindexing to height",
    " Upgrading database to version 6",
    " Reindexing block information in the database",
    " Upgrading database to version 7",
    " Upgrading database to version 12",
    " Upgrading spend journal to version 3"
  ];
  msgs.forEach((msg) => {
    expect(logging.CheckDaemonLogs(msg)).toBeTruthy();
  });

  expect(logging.CheckDaemonLogs(testDataMsg2)).toBeFalsy();
});
