import Logs from "components/views/GetStartedPage/Logs/Logs";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";

import * as wa from "wallet/daemon";
import * as sel from "selectors";

const testDcrdLogString = "test-dcrd-log";
const testDcrwalletLogString = "test-dcrwallet-log";
const testDcrDecreditonLogString = "test-dcrdecrediton-log";
const testDcrlnLogString = "test-dcrln-log";

let mockGetDcrdLogs;
let mockGetDcrwalletLogs;
let mockGetDecreditonLogs;
let mockGetDcrlndLogs;
let mockLnActive;
let mockLnStartAttempt;
let mockIsDaemonRemote;
let mockGetDaemonStarted;
let mockGetWalletReady;

beforeEach(() => {
  mockGetDcrdLogs = wa.getDcrdLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrdLogString, "utf-8"))
  );
  mockGetDcrwalletLogs = wa.getDcrwalletLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrwalletLogString, "utf-8"))
  );
  mockGetDecreditonLogs = wa.getDecreditonLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrDecreditonLogString, "utf-8"))
  );
  mockGetDcrlndLogs = wa.getDcrlndLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrlnLogString, "utf-8"))
  );
  mockLnActive = sel.lnActive = jest.fn(() => false);
  mockLnStartAttempt = sel.lnStartAttempt = jest.fn(() => false);
  mockIsDaemonRemote = sel.isDaemonRemote = jest.fn(() => false);
  mockGetDaemonStarted = sel.getDaemonStarted = jest.fn(() => false);
  mockGetWalletReady = sel.getWalletReady = jest.fn(() => false);
});

const expandLogs = async (linkText, expectedLogs) => {
  expect(screen.queryByText(expectedLogs)).not.toBeInTheDocument();

  user.click(screen.getByText(linkText));

  await wait(() =>
    Promise.resolve(expect(screen.getByText(expectedLogs)).toBeInTheDocument())
  );
};

const collapseLogs = async (linkText, expectedLogs) => {
  expect(screen.getByText(expectedLogs)).toBeInTheDocument();

  user.click(screen.getByText(linkText));

  await wait(() =>
    Promise.resolve(
      expect(screen.queryByText(expectedLogs)).not.toBeInTheDocument()
    )
  );
};

test("render default logs page", async () => {
  render(<Logs />);

  expect(screen.queryByText(/dcrwallet/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/dcrlnd/i)).not.toBeInTheDocument();

  await expandLogs("decrediton", testDcrDecreditonLogString);
  expect(screen.getByText("dcrd")).toBeInTheDocument();

  expect(mockGetDcrdLogs).toHaveBeenCalled();
  expect(mockGetDcrwalletLogs).toHaveBeenCalled();
  expect(mockGetDecreditonLogs).toHaveBeenCalled();
  expect(mockGetDcrlndLogs).toHaveBeenCalled();
  expect(mockIsDaemonRemote).toHaveBeenCalled();
  expect(mockGetDaemonStarted).toHaveBeenCalled();
  expect(mockGetWalletReady).toHaveBeenCalled();
});

test("render all logs and test if auto refresh is working", async () => {
  mockLnActive = sel.lnActive = jest.fn(() => true);
  mockGetDaemonStarted = sel.getDaemonStarted = jest.fn(() => true);
  mockGetWalletReady = sel.getWalletReady = jest.fn(() => true);
  render(<Logs />);
  expect(mockLnActive).toHaveBeenCalled();

  // test expand logs
  await expandLogs("decrediton", testDcrDecreditonLogString);
  await expandLogs("dcrd", testDcrdLogString);
  await expandLogs("dcrwallet", testDcrwalletLogString);
  await expandLogs("dcrlnd", testDcrlnLogString);

  // test collapse logs
  await collapseLogs("decrediton", testDcrDecreditonLogString);
  await collapseLogs("dcrd", testDcrdLogString);
  await collapseLogs("dcrwallet", testDcrwalletLogString);
  await collapseLogs("dcrlnd", testDcrlnLogString);

  // test reexpand logs
  await expandLogs("decrediton", testDcrDecreditonLogString);
  await expandLogs("dcrd", testDcrdLogString);
  await expandLogs("dcrwallet", testDcrwalletLogString);
  await expandLogs("dcrlnd", testDcrlnLogString);

  // test logs refresh
  mockGetDcrdLogs = wa.getDcrdLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrdLogString + "+", "utf-8"))
  );
  mockGetDcrwalletLogs = wa.getDcrwalletLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrwalletLogString + "+", "utf-8"))
  );
  mockGetDecreditonLogs = wa.getDecreditonLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrDecreditonLogString + "+", "utf-8"))
  );
  mockGetDcrdLogs = wa.getDcrlndLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrlnLogString + "+", "utf-8"))
  );
  await wait(() =>
    expect(screen.getByText(testDcrdLogString + "+")).toBeInTheDocument()
  );
  await wait(() =>
    expect(screen.getByText(testDcrwalletLogString + "+")).toBeInTheDocument()
  );
  await wait(() =>
    expect(
      screen.getByText(testDcrDecreditonLogString + "+")
    ).toBeInTheDocument()
  );
  await wait(() =>
    expect(screen.getByText(testDcrlnLogString + "+")).toBeInTheDocument()
  );
});

test("check ln logs if lnActive is true, but lnStartAttempt is false", async () => {
  mockLnActive = sel.lnActive = jest.fn(() => true);
  mockLnStartAttempt = sel.lnStartAttempt = jest.fn(() => false);
  render(<Logs />);
  expect(mockLnActive).toHaveBeenCalled();
  expect(mockLnStartAttempt).toHaveBeenCalled();
  await expandLogs("decrediton", testDcrDecreditonLogString);
  expect(screen.getByText("dcrlnd")).toBeInTheDocument();
});

test("check ln logs if lnActive is false, but lnStartAttempt is true", async () => {
  mockLnActive = sel.lnActive = jest.fn(() => false);
  mockLnStartAttempt = sel.lnStartAttempt = jest.fn(() => true);
  render(<Logs />);
  expect(mockLnActive).toHaveBeenCalled();
  expect(mockLnStartAttempt).toHaveBeenCalled();
  await expandLogs("decrediton", testDcrDecreditonLogString);
  expect(screen.getByText("dcrlnd")).toBeInTheDocument();
});
