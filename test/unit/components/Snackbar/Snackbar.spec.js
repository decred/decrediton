import Snackbar from "components/Snackbar";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { WatchOnlyWarnNotification } from "shared";
import * as sel from "selectors";
import { act } from "react-dom/test-utils";
import {
  PURCHASETICKETS_SUCCESS,
  RENAMEACCOUNT_SUCCESS,
  CHANGEPASSPHRASE_FAILED
} from "actions/ControlActions";
import { SYNCVSPTICKETS_FAILED } from "actions/VSPActions";
import { DECODERAWTXS_FAILED } from "actions/TransactionActions";
import { EXPORT_COMPLETED } from "actions/StatisticsActions";
import { WALLETREMOVED_FAILED } from "actions/DaemonActions";
import {
  TRZ_TOGGLEPINPROTECTION_SUCCESS,
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS,
  TRZ_CHANGELABEL_SUCCESS,
  TRZ_NOCONNECTEDDEVICE,
  TRZ_NOTBACKEDUP
} from "actions/TrezorActions";
import {
  LNWALLET_INVOICE_SETTLED,
  LNWALLET_SCBRESTOREUNPACK_FAILED,
  LNWALLET_EXPORTBACKUP_SUCCESS
} from "actions/LNActions";
import { CONNECTDAEMON_FAILURE } from "actions/DaemonActions";
import { NEW_TRANSACTIONS_RECEIVED } from "actions/TransactionActions";

const testFilename = "test-filename";
const testTicketHashes = ["t1"];
const testTicketHashesMulti = ["t1", "t2"];
const testTrezorDeviceLabel = "test-device-label";
const testInvoiceMemo = "test-invoice-memo";
const testDestPath = "test-dest-path";
const testErr = "test-err";
const testConnectDaemonErrorCode = "test-connect-daemon-error-code";
const testFee = 33;
const testAmount = 55;
const testTxHash = "test-tx-hash";
const selectors = sel;

let mockUiAnimations;
beforeEach(() => {
  mockUiAnimations = selectors.uiAnimations = jest.fn(() => true);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const SnackbarTesterComponent = ({ sender }) => {
  const dispatch = useDispatch();
  return (
    <button
      data-testid="snackbarSenderButton"
      onClick={() => dispatch(sender)}
    />
  );
};

test("test WatchOnlyWarnNotification without animation", async () => {
  selectors.uiAnimations = jest.fn(() => false);

  render(
    <>
      <Snackbar />
      <WatchOnlyWarnNotification isActive={true}>
        watch-only-warn-notification
      </WatchOnlyWarnNotification>
    </>
  );
  user.click(screen.getByText("watch-only-warn-notification"));
  await wait(() =>
    expect(screen.getByTestId("snackbar-message").textContent).toMatch(
      "This functionality is disabled for watch-only Wallets"
    )
  );
});

test("test a newlyMinedTransaction snackbar message", async () => {
  const sender = {
    recentRegularTransactions: [],
    recentStakeTransactions: [],
    type: NEW_TRANSACTIONS_RECEIVED,
    unminedTransactions: [],
    newlyUnminedTransactions: [],
    newlyMinedTransactions: [
      {
        fee: testFee,
        amount: testAmount,
        txHash: testTxHash,
        txDirection: "ticketfee"
      }
    ],
    stakeTransactions: {},
    regularTransactions: {}
  };
  render(
    <>
      <Snackbar />
      <SnackbarTesterComponent sender={sender} />
    </>
  );
  user.click(screen.getByTestId("snackbarSenderButton"));
  await wait(() => screen.getByTestId("transaction-notification"));
  expect(screen.getByText(String(testFee))).toBeInTheDocument();
  expect(screen.getByText(String(testAmount))).toBeInTheDocument();
  expect(screen.getAllByText(testTxHash).length).toBe(2); //one link and one tooltip
  // same tx should not showing
  user.click(screen.getByTestId("snackbarSenderButton"));
  expect(screen.getAllByTestId("transaction-notification").length).toBe(1);
});

test("test a newlyUnminedTransaction(Voted) snackbar message without direction action parameter", async () => {
  const sender = {
    recentRegularTransactions: [],
    recentStakeTransactions: [],
    type: NEW_TRANSACTIONS_RECEIVED,
    unminedTransactions: [],
    newlyUnminedTransactions: [
      {
        type: 2,
        fee: testFee,
        amount: testAmount,
        txHash: testTxHash
      }
    ],
    newlyMinedTransactions: [],
    stakeTransactions: {},
    regularTransactions: {}
  };
  render(
    <>
      <Snackbar />
      <SnackbarTesterComponent sender={sender} />
    </>
  );
  user.click(screen.getByTestId("snackbarSenderButton"));
  await wait(() => screen.getByTestId("transaction-notification"));
  expect(screen.getByText(String(testFee))).toBeInTheDocument();
  expect(screen.getByText(String(testAmount))).toBeInTheDocument();
  expect(screen.getAllByText(testTxHash).length).toBe(2); //one link and one tooltip
  expect(screen.getByText("Voted")).toBeInTheDocument();
});

test("test multi notification", async () => {
  render(
    <>
      <Snackbar />
      <SnackbarTesterComponent
        sender={{ type: WALLETREMOVED_FAILED, error: "test-error-msg1" }}
      />
    </>
  );
  const snackbarSenderButton = screen.getByTestId("snackbarSenderButton");
  user.click(snackbarSenderButton);
  await wait(() =>
    expect(screen.getByTestId("snackbar-message")).toBeInTheDocument()
  );
  expect(mockUiAnimations).toHaveBeenCalled();
  user.click(snackbarSenderButton);
  await wait(() =>
    expect(screen.getAllByTestId("snackbar-message").length).toBe(2)
  );

  //close one of the snackbar
  user.click(screen.getByRole("button", { name: "Close" }));
  await wait(() =>
    expect(screen.getAllByTestId("snackbar-message").length).toBe(1)
  );

  //close the rest
  user.click(screen.getByRole("button", { name: "Close" }));
  await wait(() =>
    expect(screen.queryByTestId("snackbar-message")).not.toBeInTheDocument()
  );

  //open again two snackbar notification and wait until they're disappearing
  jest.useFakeTimers();
  user.click(snackbarSenderButton);
  user.click(snackbarSenderButton);
  await wait(() =>
    expect(screen.getAllByTestId("snackbar-message").length).toBe(2)
  );
  // simulate that 10 * 500 seconds have passed
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  await wait(() =>
    expect(screen.getAllByTestId("snackbar-message").length).toBe(1)
  );
  // simulate that 10 * 500 seconds have passed
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  await wait(() =>
    expect(screen.queryByTestId("snackbar-message")).not.toBeInTheDocument()
  );
});

const testMessage = async (sender, expectedMessage) => {
  render(
    <>
      <Snackbar />
      <SnackbarTesterComponent sender={sender} />
    </>
  );
  user.click(screen.getByTestId("snackbarSenderButton"));
  await wait(() =>
    expect(screen.getByTestId("snackbar-message").textContent).toMatch(
      expectedMessage
    )
  );
};

const testErrorMessage = async (sender, expectedMessage) => {
  if (expectedMessage === null) {
    expectedMessage = sender.error = `${testErr}-${sender.type}`;
  }
  await testMessage(sender, expectedMessage);
};

/* test success type snackbars*/
test.each([
  [
    { filename: testFilename, type: EXPORT_COMPLETED },
    `Export of file ‘${testFilename}’ completed!`
  ],
  [{ type: RENAMEACCOUNT_SUCCESS }, "Successfully renamed account."],
  [
    {
      type: PURCHASETICKETS_SUCCESS,
      purchaseTicketsResponse: { ticketHashes: testTicketHashes }
    },
    `You bought  ${testTicketHashes.length} ticket`
  ],
  [
    {
      type: PURCHASETICKETS_SUCCESS,
      purchaseTicketsResponse: {
        ticketHashes: testTicketHashesMulti
      }
    },
    `You bought  ${testTicketHashesMulti.length} tickets`
  ],
  [
    {
      type: TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS,
      deviceLabel: testTrezorDeviceLabel,
      enablePassphraseProtection: false
    },
    `Passphrase protection has been disabled in Trezor ${testTrezorDeviceLabel}`
  ],
  [
    {
      type: TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS,
      deviceLabel: testTrezorDeviceLabel,
      enablePassphraseProtection: true
    },
    `Passphrase protection has been enabled in Trezor ${testTrezorDeviceLabel}`
  ],
  [
    { type: TRZ_CHANGELABEL_SUCCESS, deviceLabel: testTrezorDeviceLabel },
    `Changed label on selected Trezor to ${testTrezorDeviceLabel}`
  ],
  [
    {
      type: TRZ_TOGGLEPINPROTECTION_SUCCESS,
      deviceLabel: testTrezorDeviceLabel,
      clearProtection: false
    },
    `Pin protection has been enabled in Trezor ${testTrezorDeviceLabel}`
  ],
  [
    {
      type: TRZ_TOGGLEPINPROTECTION_SUCCESS,
      deviceLabel: testTrezorDeviceLabel,
      clearProtection: true
    },
    `Pin protection has been disabled in Trezor ${testTrezorDeviceLabel}`
  ],
  [
    { type: LNWALLET_INVOICE_SETTLED, invoice: { memo: testInvoiceMemo } },
    `Invoice ‘${testInvoiceMemo}’ settled!`
  ],
  [
    { type: LNWALLET_EXPORTBACKUP_SUCCESS, destPath: testDestPath },
    `Exported SCB backup file to ${testDestPath}`
  ]
])("Success type snackbar (%s) display '%s'", testMessage);

/* test error type snackbars*/
test.each([
  [{ type: WALLETREMOVED_FAILED }, null],
  [{ type: DECODERAWTXS_FAILED }, null],
  [
    { type: CHANGEPASSPHRASE_FAILED },
    "Update passphrase failed. Incorrect private passphrase, please try again."
  ],
  [
    { type: TRZ_NOCONNECTEDDEVICE },
    "No Trezor device connected. Check the device connection and Trezor bridge."
  ],
  [
    { type: TRZ_NOTBACKEDUP },
    "Trezor must be backed up in order to perform this operation."
  ],
  [
    { type: LNWALLET_SCBRESTOREUNPACK_FAILED, error: testErr },
    "SCB restore failed due to backup file being for a different wallet, account or the file being damaged.\nTry other accounts, wallets or check the documentation for additional info."
  ],
  [{ type: SYNCVSPTICKETS_FAILED }, null],
  [
    {
      type: SYNCVSPTICKETS_FAILED,
      error: "wallet.Unlock: invalid passphrase:: secretkey.DeriveKey"
    },
    "Wrong private passphrase entered."
  ],
  [
    {
      type: SYNCVSPTICKETS_FAILED,
      error: { f: 1, lf: 2 }
    },
    "The following error happened: f: 1lf: 2"
  ],
  [
    {
      type: CONNECTDAEMON_FAILURE
    },
    "Error connecting to daemon"
  ],
  [
    {
      type: CONNECTDAEMON_FAILURE,
      daemonTimeout: true
    },
    "Daemon connection timeout exceeded.\n That Probably means you filled your parameters wrong. Please review it."
  ],
  [
    {
      type: CONNECTDAEMON_FAILURE,
      error: { code: testConnectDaemonErrorCode }
    },
    testConnectDaemonErrorCode
  ]
])("Error type snackbar (%s)", testErrorMessage);
