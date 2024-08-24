import ProcessUnmanagedTickets from "components/views/GetStartedPage/SetupWallet/ProcessUnmanagedTickets";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as wal from "wallet";
import * as arrs from "../../../../../../app/helpers/arrays";
const selectors = sel;
const wallet = wal;
const arrays = arrs;
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import {
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_CONFIRMED,
  EXTERNALREQUEST_STAKEPOOL_LISTING
} from "constants";
import {
  defaultMockAvailableMainnetVsps,
  defaultMockAvailableTestnetVsps,
  defaultMockAvailableInvalidVsps,
  mockPubkeys,
  fetchTimes
} from "../../../../actions/vspMocks";
import {
  testBalances,
  changeAccountNumber,
  mixedAccountNumber,
  defaultAccountNumber,
  mockUnlockLockAndGetAccountsAttempt
} from "../../../../actions/accountMocks";
import { cloneDeep } from "lodash";

const mockAvailableMainnetVsps = cloneDeep(defaultMockAvailableMainnetVsps);
const mockSend = jest.fn(() => {});
const mockCancel = jest.fn(() => {});

const testPassphrase = "test-passphrase";
const testWalletService = "test-wallet-service";
const testError = "test-error";
const testCustomVspHost = "custom-vsp-host";
const testCustomVspHostPubkey = "test-custom-vsp-host-pubkey";

let mockProcessUnmanagedTickets;
let mockGetVSPTicketsByFeeStatus;
let mockGetAllVSPs;
let mockGetVSPInfo;
beforeEach(() => {
  selectors.getAvailableVSPsPubkeys = jest.fn(() => null);
  selectors.balances = jest.fn(() => cloneDeep(testBalances));
  selectors.unlockableAccounts = jest.fn(() =>
    cloneDeep(testBalances).filter(
      (acct) => acct.accountNumber < Math.pow(2, 31) - 1 && acct.encrypted
    )
  );
  arrays.shuffle = jest.fn((arr) => arr);
  selectors.getVSPInfoTimeoutTime = jest.fn(() => 100);
  selectors.isTestNet = jest.fn(() => false);
  selectors.resendVSPDVoteChoicesAttempt = jest.fn(() => false);
  selectors.walletService = jest.fn(() => testWalletService);
  selectors.defaultSpendingAccount = jest.fn(() => ({
    value: defaultAccountNumber
  }));
  selectors.getMixedAccount = jest.fn(() => mixedAccountNumber);
  selectors.getChangeAccount = jest.fn(() => changeAccountNumber);
  mockGetAllVSPs = wallet.getAllVSPs = jest.fn(() => [
    ...cloneDeep(mockAvailableMainnetVsps),
    ...cloneDeep(defaultMockAvailableTestnetVsps),
    ...cloneDeep(defaultMockAvailableInvalidVsps)
  ]);
  mockGetVSPInfo = wallet.getVSPInfo = jest.fn((host) => {
    if (host === `https://${testCustomVspHost}`) {
      return Promise.resolve({ data: { pubkey: testCustomVspHostPubkey } });
    }
    if (!mockPubkeys[host]) {
      return Promise.reject("invalid host");
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        mockPubkeys[host] !== "invalid"
          ? resolve({ data: { pubkey: mockPubkeys[host] } })
          : mockPubkeys[host]
          ? resolve({ data: {} })
          : reject("invalid host");
      }, fetchTimes[host]);
    });
  });
  mockProcessUnmanagedTickets = wallet.processUnmanagedTicketsStartup = jest.fn(
    () => {}
  );
  wallet.getVSPTrackedTickets = jest.fn(() => Promise.resolve());
  mockGetVSPTicketsByFeeStatus = wallet.getVSPTicketsByFeeStatus = jest.fn(() =>
    Promise.resolve({
      ticketHashes: []
    })
  );

  selectors.getAvailableVSPs = jest.fn(() => mockAvailableMainnetVsps);
});

const getSkipButton = () => screen.getByRole("button", { name: "Skip" });
const getCancelButton = () => screen.getByRole("button", { name: "Cancel" });
const getContinueButton = () =>
  screen.getByRole("button", { name: "Continue" });
const getModalContinueButton = () =>
  screen.getAllByRole("button", { name: "Continue" })[1];

const initialState = {
  grpc: {
    walletService: testWalletService
  },
  settings: {
    currentSettings: {
      theme: DEFAULT_LIGHT_THEME_NAME,
      allowedExternalRequests: [EXTERNALREQUEST_STAKEPOOL_LISTING]
    },
    tempSettings: {
      theme: DEFAULT_LIGHT_THEME_NAME,
      allowedExternalRequests: [EXTERNALREQUEST_STAKEPOOL_LISTING]
    }
  }
};

test("skip ProcessUnmanagedTickets and show error", async () => {
  const { user } = render(
    <ProcessUnmanagedTickets
      send={mockSend}
      cancel={mockCancel}
      error={testError}
    />
  );
  expect(screen.getByText(testError)).toBeInTheDocument();
  await user.click(getSkipButton());
  expect(mockCancel).toHaveBeenCalled();
});

test("do ProcessUnmanagedTickets - in a private wallet", async () => {
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessUnmanagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  expect(continueButton.disabled).toBe(true);

  await user.click(screen.getByText("Select VSP..."));
  await user.click(screen.getByText(mockAvailableMainnetVsps[0].host));
  expect(screen.getByText("Loading")).toBeInTheDocument();
  await waitFor(() => expect(getContinueButton().disabled).toBeFalsy());
  expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  expect(
    screen.getByText(mockAvailableMainnetVsps[0].host)
  ).toBeInTheDocument();

  await user.click(continueButton);
  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelButton());

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessUnmanagedTickets).toHaveBeenCalledWith(
    testWalletService,
    defaultMockAvailableMainnetVsps[0].host,
    mockPubkeys[`https://${mockAvailableMainnetVsps[0].host}`],
    mixedAccountNumber,
    changeAccountNumber
  );

  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    VSP_FEE_PROCESS_ERRORED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    VSP_FEE_PROCESS_STARTED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    VSP_FEE_PROCESS_PAID
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    4,
    testWalletService,
    VSP_FEE_PROCESS_CONFIRMED
  );

  expect(mockGetAllVSPs).not.toHaveBeenCalled();
  expect(mockGetVSPInfo).toHaveBeenCalled();
});

test("do ProcessUnmanagedTickets - in a default wallet", async () => {
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessUnmanagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  expect(continueButton.disabled).toBe(true);

  await user.click(screen.getByText("Select VSP..."));
  await user.click(screen.getByText(mockAvailableMainnetVsps[0].host));
  expect(screen.getByText("Loading")).toBeInTheDocument();
  await waitFor(() => expect(getContinueButton().disabled).toBeFalsy());
  expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  expect(
    screen.getByText(mockAvailableMainnetVsps[0].host)
  ).toBeInTheDocument();

  await user.click(continueButton);
  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelButton());

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessUnmanagedTickets).toHaveBeenCalledWith(
    testWalletService,
    defaultMockAvailableMainnetVsps[0].host,
    mockPubkeys[`https://${mockAvailableMainnetVsps[0].host}`],
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    VSP_FEE_PROCESS_ERRORED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    VSP_FEE_PROCESS_STARTED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    VSP_FEE_PROCESS_PAID
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    4,
    testWalletService,
    VSP_FEE_PROCESS_CONFIRMED
  );

  expect(mockGetAllVSPs).not.toHaveBeenCalled();
  expect(mockGetVSPInfo).toHaveBeenCalled();
});

test("do ProcessUnmanagedTickets - vsp listing is not enabled", async () => {
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessUnmanagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState: cloneDeep({
        ...initialState,
        settings: {
          ...initialState.settings,
          tempSettings: {
            ...initialState.settings.tempSettings,
            allowedExternalRequests: []
          }
        }
      })
    }
  );

  const continueButton = getContinueButton();
  expect(continueButton.disabled).toBe(true);

  await user.type(screen.getByRole("combobox"), testCustomVspHost);
  await user.click(screen.getByText(`Create "${testCustomVspHost}"`));
  await waitFor(() =>
    expect(screen.getByText(testCustomVspHost)).toBeInTheDocument()
  );

  await user.click(continueButton);
  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelButton());

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessUnmanagedTickets).toHaveBeenCalledWith(
    testWalletService,
    testCustomVspHost,
    testCustomVspHostPubkey,
    mixedAccountNumber,
    changeAccountNumber
  );

  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    VSP_FEE_PROCESS_ERRORED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    VSP_FEE_PROCESS_STARTED
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    VSP_FEE_PROCESS_PAID
  );
  expect(mockGetVSPTicketsByFeeStatus).toHaveBeenNthCalledWith(
    4,
    testWalletService,
    VSP_FEE_PROCESS_CONFIRMED
  );

  expect(mockGetAllVSPs).not.toHaveBeenCalled();
  expect(mockGetVSPInfo).toHaveBeenCalled();
});

test("do ProcessUnManagedTickets - failed", async () => {
  mockProcessUnmanagedTickets = wallet.processUnmanagedTicketsStartup = jest.fn(
    () => {
      throw testError;
    }
  );
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessUnmanagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  expect(continueButton.disabled).toBe(true);

  await user.click(screen.getByText("Select VSP..."));
  await user.click(screen.getByText(mockAvailableMainnetVsps[0].host));
  await waitFor(() => screen.getByText("Loading"));
  await waitFor(() => expect(getContinueButton().disabled).toBeFalsy());
  expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  expect(
    screen.getByText(mockAvailableMainnetVsps[0].host)
  ).toBeInTheDocument();

  await user.click(continueButton);
  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessUnmanagedTickets).toHaveBeenCalledWith(
    testWalletService,
    defaultMockAvailableMainnetVsps[0].host,
    mockPubkeys[`https://${mockAvailableMainnetVsps[0].host}`],
    mixedAccountNumber,
    changeAccountNumber
  );

  expect(mockGetVSPTicketsByFeeStatus).not.toHaveBeenCalled();
});
