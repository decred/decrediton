import Logs from "components/views/GetStartedPage/Logs/Logs";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import * as wa from "wallet";
import * as sel from "selectors";

const testDcrdLogString = "test-dcrd-log";
const testDcrwalletLogString = "test-dcrwallet-log";
const testDcrDecreditonLogString = "test-dcrdecrediton-log";
const testDcrlnLogString = "test-dcrln-log";
const wallet = wa;
const selectors = sel;

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
  mockGetDcrdLogs = wallet.getDcrdLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrdLogString, "utf-8"))
  );
  mockGetDcrwalletLogs = wallet.getDcrwalletLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrwalletLogString, "utf-8"))
  );
  mockGetDecreditonLogs = wallet.getDecreditonLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrDecreditonLogString, "utf-8"))
  );
  mockGetDcrlndLogs = wallet.getDcrlndLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrlnLogString, "utf-8"))
  );
  mockLnActive = selectors.lnActive = jest.fn(() => false);
  mockLnStartAttempt = selectors.lnStartAttempt = jest.fn(() => false);
  mockIsDaemonRemote = selectors.isDaemonRemote = jest.fn(() => false);
  mockGetDaemonStarted = selectors.getDaemonStarted = jest.fn(() => false);
  mockGetWalletReady = selectors.getWalletReady = jest.fn(() => false);
});

const expandLogs = async (linkText, expectedLogs) => {
  expect(screen.queryByText(expectedLogs)).not.toBeInTheDocument();

  user.click(screen.getByText(linkText));

  await waitFor(() =>
    Promise.resolve(expect(screen.getByText(expectedLogs)).toBeInTheDocument())
  );
};

const collapseLogs = async (linkText, expectedLogs) => {
  expect(screen.getByText(expectedLogs)).toBeInTheDocument();

  user.click(screen.getByText(linkText));

  await waitFor(() =>
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
  jest.useFakeTimers();
  mockLnActive = selectors.lnActive = jest.fn(() => true);
  mockGetDaemonStarted = selectors.getDaemonStarted = jest.fn(() => true);
  mockGetWalletReady = selectors.getWalletReady = jest.fn(() => true);
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
  mockGetDcrdLogs = wallet.getDcrdLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrdLogString + "+", "utf-8"))
  );
  mockGetDcrwalletLogs = wallet.getDcrwalletLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrwalletLogString + "+", "utf-8"))
  );
  mockGetDecreditonLogs = wallet.getDecreditonLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrDecreditonLogString + "+", "utf-8"))
  );
  mockGetDcrdLogs = wallet.getDcrlndLogs = jest.fn(() =>
    Promise.resolve(Buffer.from(testDcrlnLogString + "+", "utf-8"))
  );

  act(() => {
    jest.advanceTimersByTime(1001);
  });
  await waitFor(() =>
    expect(screen.getByText(testDcrdLogString + "+")).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(screen.getByText(testDcrwalletLogString + "+")).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(
      screen.getByText(testDcrDecreditonLogString + "+")
    ).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(screen.getByText(testDcrlnLogString + "+")).toBeInTheDocument()
  );
});

test("check ln logs if lnActive is true, but lnStartAttempt is false", async () => {
  mockLnActive = selectors.lnActive = jest.fn(() => true);
  mockLnStartAttempt = selectors.lnStartAttempt = jest.fn(() => false);
  render(<Logs />);
  expect(mockLnActive).toHaveBeenCalled();
  expect(mockLnStartAttempt).toHaveBeenCalled();
  await expandLogs("decrediton", testDcrDecreditonLogString);
  expect(screen.getByText("dcrlnd")).toBeInTheDocument();
});

test("check ln logs if lnActive is false, but lnStartAttempt is true", async () => {
  mockLnActive = selectors.lnActive = jest.fn(() => false);
  mockLnStartAttempt = selectors.lnStartAttempt = jest.fn(() => true);
  render(<Logs />);
  expect(mockLnActive).toHaveBeenCalled();
  expect(mockLnStartAttempt).toHaveBeenCalled();
  await expandLogs("decrediton", testDcrDecreditonLogString);
  expect(screen.getByText("dcrlnd")).toBeInTheDocument();
});
