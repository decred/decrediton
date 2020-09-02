import Logs from "components/views/GetStartedPage/Logs/Logs";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";

import * as wa from "wallet/daemon";

const testDcrdLogString = "test-dcrd-log";
const testDcrwalletLogString = "test-dcrwallet-log";
const testDcrDecreditonLogString = "test-dcrdecrediton-log";
const testDcrlnLogString = "test-dcrln-log";

let mockGetDcrdLogs;
let mockGetDcrwalletLogs;
let mockGetDecreditonLogs;
let mockGetDcrlndLogs;

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

  expect(screen.queryByText(/dcrd/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/dcrwallet/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/dcrlnd/i)).not.toBeInTheDocument();

  await expandLogs("decrediton", testDcrDecreditonLogString);

  expect(mockGetDcrdLogs).toHaveBeenCalled();
  expect(mockGetDcrwalletLogs).toHaveBeenCalled();
  expect(mockGetDecreditonLogs).toHaveBeenCalled();
  expect(mockGetDcrlndLogs).toHaveBeenCalled();
});

test("render all logs and test if auto refresh is working", async () => {
  render(<Logs />, {
    initialState: {
      daemon: { daemonRemote: false, daemonStarted: true, walletReady: true },
      ln: { active: true, startAttempt: true }
    }
  });

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
