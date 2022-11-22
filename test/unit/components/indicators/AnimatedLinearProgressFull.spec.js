import AnimatedLinearProgressFull from "components/indicators/AnimatedLinearProgressFull";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";
import { act } from "react-dom/test-utils";
import { wait } from "@testing-library/react";

const testProps = {
  min: 0,
  text: "testText",
  animationType: "testAnimationType"
};
const selectors = sel;
const daemonActions = da;

test("tests default AnimatedLinearProgressFull", () => {
  const testNeededBlocks = 485461;
  let testCurrentBlockCount = 0;

  // set testSyncFetchHeadersLastHeaderTime to two hours ago
  const testSyncFetchHeadersLastHeaderTime = new Date();
  testSyncFetchHeadersLastHeaderTime.setHours(
    testSyncFetchHeadersLastHeaderTime.getHours() - 2
  );

  const mockIsSPV = (selectors.isSPV = jest.fn(() => false));
  const mockStakeTransactions = (selectors.stakeTransactions = jest.fn(
    () => []
  ));
  const mockGetSelectedWallet = (selectors.getSelectedWallet = jest.fn(() => {
    return {};
  }));
  const mockSyncFetchHeadersLastHeaderTime =
    (selectors.syncFetchHeadersLastHeaderTime = jest.fn(
      () => testSyncFetchHeadersLastHeaderTime
    ));

  let mockGetCurrentBlockCount = (selectors.getCurrentBlockCount = jest.fn(
    () => testCurrentBlockCount
  ));
  const mockGetNeededBlocks = (selectors.getNeededBlocks = jest.fn(
    () => testNeededBlocks
  ));
  const mockGetEstimatedTimeLeft = (selectors.getEstimatedTimeLeft = jest.fn(
    () => 3113
  ));

  const checkLinearProgressBar = (expectedWidth) => {
    mockGetCurrentBlockCount = selectors.getCurrentBlockCount = jest.fn(
      () => testCurrentBlockCount
    );

    rerender(<AnimatedLinearProgressFull {...testProps} />);
    if (testCurrentBlockCount > 0) {
      expect(
        screen.getByText(
          `in 1 hour(${testCurrentBlockCount} / ${testNeededBlocks})`
        )
      ).toBeInTheDocument();
    }

    if (expectedWidth > 0) {
      const textElement = screen.getByText(testProps.text);
      const linearProgressBar = textElement.previousSibling;
      expect(linearProgressBar).toHaveClass("linearProgressBar");
      expect(linearProgressBar).toHaveStyle(`width: ${expectedWidth}%;`);
    }
  };

  const { rerender } = render(<AnimatedLinearProgressFull {...testProps} />);

  expect(mockIsSPV).toHaveBeenCalled();
  expect(mockGetNeededBlocks).toHaveBeenCalled();
  expect(mockGetEstimatedTimeLeft).toHaveBeenCalled();
  expect(mockGetCurrentBlockCount).toHaveBeenCalled();
  expect(mockSyncFetchHeadersLastHeaderTime).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockStakeTransactions).toHaveBeenCalled();

  // time from last fetched header info is shown
  expect(
    screen.getByText(/2 hours ago/i).closest("div.loaderBarEstimation")
      .textContent
  ).toBe("Time from last fetched header: 2 hours ago");

  expect(
    screen.getByText(testProps.text).parentNode.nextSibling.firstChild
  ).toHaveClass(`icon ${testProps.animationType}`);
  checkLinearProgressBar(0);

  /* increase current block count */
  testCurrentBlockCount = 100267;
  checkLinearProgressBar(20.653976323535773);

  /* increase current block count */
  testCurrentBlockCount = 190267;
  checkLinearProgressBar(39.19305567285529);

  /* increase current block count */
  testCurrentBlockCount = 290267;
  checkLinearProgressBar(59.79203272765474);

  /* increase current block count */
  testCurrentBlockCount = 350267;
  checkLinearProgressBar(72.15141896053441);

  /* increase current block count */
  testCurrentBlockCount = 400267;
  checkLinearProgressBar(82.45090748793415);

  /* increase current block count */
  testCurrentBlockCount = 460267;
  checkLinearProgressBar(94.81029372081382);

  /* increase current block count */
  testCurrentBlockCount = testNeededBlocks;
  checkLinearProgressBar(100);

  // test error mode
  rerender(<AnimatedLinearProgressFull error={true} {...testProps} />);
  expect(screen.getByText(testProps.text).previousSibling).toHaveClass(
    "linearProgressBar error"
  );

  mockIsSPV.mockRestore();
  mockGetNeededBlocks.mockRestore();
  mockGetEstimatedTimeLeft.mockRestore();
  mockGetCurrentBlockCount.mockRestore();
  mockSyncFetchHeadersLastHeaderTime.mockRestore();
  mockGetSelectedWallet.mockRestore();
});

test("dcrwallet log line is shown or log the error to console", async () => {
  jest.useFakeTimers();

  const mockIsSPV = (selectors.isSPV = jest.fn(() => false));
  const mockGetSelectedWallet = (selectors.getSelectedWallet = jest.fn(
    () => true
  ));
  const mockGetCurrentBlockCount = (selectors.getCurrentBlockCount = jest.fn(
    () => 0
  ));
  const mockGetNeededBlocks = (selectors.getNeededBlocks = jest.fn(() => 0));
  const mockGetEstimatedTimeLeft = (selectors.getEstimatedTimeLeft = jest.fn(
    () => 0
  ));
  const mockConsoleLog = jest
    .spyOn(console, "log")
    .mockImplementation(() => {});

  const testDcrwalletLogLine = "testDcrwalletLogLine";
  let mockGetDcrwalletLogs = (daemonActions.getDcrwalletLogs = jest.fn(
    () => () => Promise.resolve(testDcrwalletLogLine)
  ));

  const mockGetDcrdLastLineLogs = (daemonActions.getDcrdLastLineLogs = jest.fn(
    () => () => Promise.reject()
  ));
  render(<AnimatedLinearProgressFull {...testProps} />);
  expect(mockGetSelectedWallet).toHaveBeenCalled();

  // test DcrwalletLogLine
  expect(screen.queryByText(testDcrwalletLogLine)).not.toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(2001);
  });
  await wait(() =>
    expect(screen.getByText(testDcrwalletLogLine)).toBeInTheDocument()
  );

  // test DcrwalletLogLine error
  mockGetDcrwalletLogs = daemonActions.getDcrwalletLogs = jest.fn(
    () => () => Promise.reject()
  );
  act(() => {
    jest.advanceTimersByTime(2001);
  });
  await wait(() => expect(mockConsoleLog).toHaveBeenCalled());

  mockGetDcrdLastLineLogs.mockRestore();
  mockConsoleLog.mockRestore();
  mockIsSPV.mockRestore();
  mockGetNeededBlocks.mockRestore();
  mockGetEstimatedTimeLeft.mockRestore();
  mockGetCurrentBlockCount.mockRestore();
  mockGetDcrwalletLogs.mockRestore();
  mockGetSelectedWallet.mockRestore();
  jest.useRealTimers();
});

test("tests when deamon is synced", () => {
  const mockIsSPV = (selectors.isSPV = jest.fn(() => false));
  const mockStakeTransactions = (selectors.stakeTransactions = jest.fn(
    () => []
  ));
  const mockGetDaemonSynced = (selectors.getDaemonSynced = jest.fn(() => true));
  render(<AnimatedLinearProgressFull {...testProps} />);

  const textElement = screen.getByText(testProps.text);
  expect(
    screen.getByText(testProps.text).parentNode.nextSibling.firstChild
  ).toHaveClass(`icon ${testProps.animationType}`);
  expect(textElement.previousSibling).toBe(null);

  mockIsSPV.mockRestore();
  mockStakeTransactions.mockRestore();
  mockGetDaemonSynced.mockRestore();
});

test("tests when isSPV is true", () => {
  const mockIsSPV = (selectors.isSPV = jest.fn(() => true));
  const mockGetDaemonSynced = (selectors.getDaemonSynced = jest.fn(
    () => false
  ));
  const mockStakeTransactions = (selectors.stakeTransactions = jest.fn(
    () => []
  ));
  render(<AnimatedLinearProgressFull {...testProps} />);

  const textElement = screen.getByText(testProps.text);
  expect(textElement.parentNode.nextSibling.firstChild.nextSibling).toHaveClass(
    `icon ${testProps.animationType}`
  );
  expect(textElement.parentNode.nextSibling.firstChild.textContent).toMatch(
    /spv mode/i
  );

  mockIsSPV.mockRestore();
  mockStakeTransactions.mockRestore();
  mockGetDaemonSynced.mockRestore();
});

test("receiving null `estimatedTimeLeft` does no shows `Time from last fetched header` label", () => {
  const mockGetEstimatedTimeLeft = (selectors.getEstimatedTimeLeft = jest.fn(
    () => null
  ));
  render(<AnimatedLinearProgressFull {...testProps} />);
  expect(
    screen.queryByText(/Time from last fetched header:/i)
  ).not.toBeInTheDocument();
  mockGetEstimatedTimeLeft.mockRestore();
});
