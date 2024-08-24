import ProcessManagedTickets from "components/views/GetStartedPage/SetupWallet/ProcessManagedTickets";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as wal from "wallet";
import * as arrs from "../../../../../../app/helpers/arrays";
const selectors = sel;
const wallet = wal;
const arrays = arrs;
import {
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_CONFIRMED
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
const mockAvailableMainnetVspsPubkeys = cloneDeep(
  defaultMockAvailableMainnetVsps
).map((v) => ({ ...v, pubkey: `${v.host}-pubkey` }));
const mockSend = jest.fn(() => {});
const mockCancel = jest.fn(() => {});

const testPassphrase = "test-passphrase";
const testWalletService = "test-wallet-service";
const testError = "test-error";

let mockProcessManagedTickets;
let mockGetVSPTicketsByFeeStatus;
let mockGetVSPTrackedTickets;
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
  mockProcessManagedTickets = wallet.processManagedTickets = jest.fn(() => {});
  mockGetVSPTrackedTickets = wallet.getVSPTrackedTickets = jest.fn(() =>
    Promise.resolve()
  );
  mockGetVSPTicketsByFeeStatus = wallet.getVSPTicketsByFeeStatus = jest.fn(() =>
    Promise.resolve({
      ticketHashes: []
    })
  );
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
  }
};

test("skip ProcessManagedTickets and show error", async () => {
  const { user } = render(
    <ProcessManagedTickets
      send={mockSend}
      cancel={mockCancel}
      error={testError}
    />
  );
  await user.click(getSkipButton());
  expect(screen.getByText(testError)).toBeInTheDocument();
  expect(mockCancel).toHaveBeenCalled();
});

test("do ProcessManagedTickets - in a private wallet", async () => {
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessManagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  await user.click(continueButton);

  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelButton());

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    defaultMockAvailableMainnetVsps[0].host,
    mockPubkeys[`https://${mockAvailableMainnetVsps[0].host}`],
    mixedAccountNumber,
    changeAccountNumber
  );

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    defaultMockAvailableMainnetVsps[3].host,
    mockPubkeys[`https://${mockAvailableMainnetVsps[3].host}`],
    mixedAccountNumber,
    changeAccountNumber
  );

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    defaultMockAvailableMainnetVsps[5].host,
    mockPubkeys[`https://${mockAvailableMainnetVsps[5].host}`],
    mixedAccountNumber,
    changeAccountNumber
  );

  expect(mockGetVSPTrackedTickets).toHaveBeenCalledTimes(1);

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

  expect(mockGetAllVSPs).toHaveBeenCalled();
  expect(mockGetVSPInfo).toHaveBeenCalled();
});

test("do ProcessManagedTickets - in a default wallet, available vps pubkeys have been already fetched", async () => {
  selectors.getAvailableVSPsPubkeys = jest.fn(
    () => mockAvailableMainnetVspsPubkeys
  );
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessManagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  await user.click(continueButton);

  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelButton());

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    defaultMockAvailableMainnetVsps[0].host,
    `${mockAvailableMainnetVsps[0].host}-pubkey`,
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    defaultMockAvailableMainnetVsps[1].host,
    `${mockAvailableMainnetVsps[1].host}-pubkey`,
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    defaultMockAvailableMainnetVsps[2].host,
    `${mockAvailableMainnetVsps[2].host}-pubkey`,
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockGetVSPTrackedTickets).toHaveBeenCalledTimes(1);

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
  expect(mockGetVSPInfo).not.toHaveBeenCalled();
});

test("do ProcessManagedTickets - in a default wallet, available vps pubkeys have been already fetched", async () => {
  selectors.getAvailableVSPsPubkeys = jest.fn(
    () => mockAvailableMainnetVspsPubkeys
  );
  selectors.getMixedAccount = jest.fn(() => null);
  selectors.getChangeAccount = jest.fn(() => null);
  mockUnlockLockAndGetAccountsAttempt();
  const { user } = render(
    <ProcessManagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  await user.click(continueButton);

  expect(screen.getByText("Passphrase")).toBeInTheDocument();

  // cancel first
  await user.click(getCancelButton());

  await user.click(continueButton);
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    1,
    testWalletService,
    defaultMockAvailableMainnetVsps[0].host,
    `${mockAvailableMainnetVsps[0].host}-pubkey`,
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    2,
    testWalletService,
    defaultMockAvailableMainnetVsps[1].host,
    `${mockAvailableMainnetVsps[1].host}-pubkey`,
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockProcessManagedTickets).toHaveBeenNthCalledWith(
    3,
    testWalletService,
    defaultMockAvailableMainnetVsps[2].host,
    `${mockAvailableMainnetVsps[2].host}-pubkey`,
    defaultAccountNumber,
    defaultAccountNumber
  );

  expect(mockGetVSPTrackedTickets).toHaveBeenCalledTimes(1);

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
  expect(mockGetVSPInfo).not.toHaveBeenCalled();
});

test("do ProcessManagedTickets - failed to fetch vsps", async () => {
  mockUnlockLockAndGetAccountsAttempt();
  mockGetAllVSPs = wallet.getAllVSPs = jest.fn(() => {
    throw testError;
  });
  const { user } = render(
    <ProcessManagedTickets send={mockSend} cancel={mockCancel} />,
    {
      initialState
    }
  );
  const continueButton = getContinueButton();
  await user.click(continueButton);

  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  await user.click(getModalContinueButton());

  await waitFor(() => expect(mockSend).toHaveBeenCalled());

  expect(mockGetAllVSPs).toHaveBeenCalled();
  expect(mockProcessManagedTickets).not.toHaveBeenCalled();
  expect(mockGetVSPTrackedTickets).not.toHaveBeenCalled();
  expect(mockGetVSPTicketsByFeeStatus).not.toHaveBeenCalled();
  expect(mockGetVSPInfo).not.toHaveBeenCalled();
});
