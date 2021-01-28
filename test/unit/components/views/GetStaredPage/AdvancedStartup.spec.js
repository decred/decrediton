import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as config from "config.js";
import * as da from "actions/DaemonActions";

const testRemoteCredentials = {
  rpc_pass: "test-rpcpass",
  rpc_user: "test-rpcuser",
  rpc_cert: "test-rpccert",
  rpc_host: "test-rpchost",
  rpc_port: "test-rpcport"
};
const testEmptyRemoteCredentials = {
  rpc_pass: "",
  rpc_user: "",
  rpc_cert: "",
  rpc_host: "",
  rpc_port: ""
};
const testConnectDaemonErrorMsg = { error: "test-connect-daemon-error-msw" };
const testStartDaemonErrorMsg = "test-start-daemon-error-msw";
const testDaemonDataDirectory = "test-daemon-data-directory";

let mockIsAdvancedDaemon;
let mockGetRemoteCredentials;
let mockSetRemoteCredentials;
let mockGetAppdataPath;
let mockSetAppdataPath;
let mockConnectDaemon;
let mockStartDaemon;

beforeEach(() => {
  sel.isSPV = jest.fn(() => false);
  mockIsAdvancedDaemon = sel.isAdvancedDaemon = jest.fn(() => true);
  mockGetRemoteCredentials = config.getRemoteCredentials = jest.fn(
    () => testEmptyRemoteCredentials
  );
  mockSetRemoteCredentials = config.setRemoteCredentials = jest.fn(() => {});
  mockGetAppdataPath = config.getAppdataPath = jest.fn(() => "");
  mockSetAppdataPath = config.setAppdataPath = jest.fn(() => "");
  mockConnectDaemon = da.connectDaemon = jest.fn(() => () =>
    Promise.reject(testConnectDaemonErrorMsg)
  );
  mockStartDaemon = da.startDaemon = jest.fn(() => () =>
    Promise.reject(testStartDaemonErrorMsg)
  );
  sel.stakeTransactions = jest.fn(() => []);
});

test("test remote daemon form", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(mockIsAdvancedDaemon).toHaveBeenCalled();
  expect(mockGetRemoteCredentials).toHaveBeenCalled();
  expect(mockGetAppdataPath).toHaveBeenCalled();
  expect(
    screen.getByText(/waiting for daemon connection.../i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/complete one of the following/i).textContent
  ).toMatchInlineSnapshot(
    `"Complete one of the following forms to start Decrediton according to your local setup."`
  );

  //test toggle control
  user.click(
    screen.getByText(/different local daemon location/i).previousSibling
  );
  expect(screen.getByText("Daemon Data Directory:")).toBeInTheDocument();
  user.click(
    screen.getByText(/different local daemon location/i).previousSibling
  );

  const rpcUsernameInput = screen.getByPlaceholderText(/rpc username/i);
  const rpcPasswordInput = screen.getByPlaceholderText(/rpc password/i);
  const rpcCertificatePathInput = screen.getByPlaceholderText(
    /rpc certificate path/i
  );
  const rpcHostInput = screen.getByPlaceholderText(/rpc host/i);
  const rpcPortInput = screen.getByPlaceholderText(/rpc port/i);

  expect(rpcUsernameInput.value).toMatch("");
  expect(rpcPasswordInput.value).toMatch("");
  expect(rpcCertificatePathInput.value).toMatch("");
  expect(rpcHostInput.value).toMatch("");
  expect(rpcPortInput.value).toMatch("");

  user.type(rpcUsernameInput, testRemoteCredentials.rpc_user);
  user.type(rpcPasswordInput, testRemoteCredentials.rpc_pass);
  user.type(rpcCertificatePathInput, testRemoteCredentials.rpc_cert);
  user.type(rpcHostInput, testRemoteCredentials.rpc_host);
  user.type(rpcPortInput, testRemoteCredentials.rpc_port);

  user.clear(rpcUsernameInput);
  user.clear(rpcPasswordInput);
  user.clear(rpcCertificatePathInput);
  user.clear(rpcHostInput);
  user.clear(rpcPortInput);

  expect(screen.getAllByText(/this field is required/i).length).toBe(5);

  // type rpc credentials again
  user.type(rpcUsernameInput, testRemoteCredentials.rpc_user);
  user.type(rpcPasswordInput, testRemoteCredentials.rpc_pass);
  user.type(rpcCertificatePathInput, testRemoteCredentials.rpc_cert);
  user.type(rpcHostInput, testRemoteCredentials.rpc_host);
  user.type(rpcPortInput, testRemoteCredentials.rpc_port);

  expect(rpcUsernameInput.value).toMatch(testRemoteCredentials.rpc_user);
  expect(rpcPasswordInput.value).toMatch(testRemoteCredentials.rpc_pass);
  expect(rpcCertificatePathInput.value).toMatch(testRemoteCredentials.rpc_cert);
  expect(rpcHostInput.value).toMatch(testRemoteCredentials.rpc_host);
  expect(rpcPortInput.value).toMatch(testRemoteCredentials.rpc_port);

  user.click(screen.getByText(/use remote daemon/i));
  expect(mockSetRemoteCredentials).toHaveBeenCalled();
  expect(mockConnectDaemon).toHaveBeenCalledWith(testRemoteCredentials, true);
  await wait(() => screen.getByText(JSON.stringify(testConnectDaemonErrorMsg)));
});

test("test local daemon form", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(
    screen.getByText(/different local daemon location/i).previousSibling
  );
  expect(screen.getByText("Daemon Data Directory:")).toBeInTheDocument();
  const daemonDataDirectoryInput = screen.getByPlaceholderText(
    "Daemon Data Directory"
  );
  user.type(daemonDataDirectoryInput, testDaemonDataDirectory);
  user.clear(daemonDataDirectoryInput);
  expect(screen.getAllByText(/this field is required/i).length).toBe(1);
  // type data directory again
  user.type(daemonDataDirectoryInput, testDaemonDataDirectory);

  user.click(screen.getByText(/start appdata daemon/i));
  expect(mockSetAppdataPath).toHaveBeenCalledWith(testDaemonDataDirectory);
  expect(mockStartDaemon).toHaveBeenCalledWith({
    appdata: testDaemonDataDirectory
  });
  await wait(() => screen.getByText(testStartDaemonErrorMsg));
});

test("test skip link", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/skip/i));
  await wait(() => screen.getByText(testStartDaemonErrorMsg));
});
