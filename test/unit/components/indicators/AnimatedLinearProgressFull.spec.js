import AnimatedLinearProgressFull from "components/indicators/LinearProgress/AnimatedLinearProgressFull";
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

test("tests default AnimatedLinearProgressFull", () => {
  const testNeededBlocks = 485461;
  let testCurrentBlockCount = 0;

  // set testSyncFetchHeadersLastHeaderTime to two hours ago
  const testSyncFetchHeadersLastHeaderTime = new Date();
  testSyncFetchHeadersLastHeaderTime.setHours(
    testSyncFetchHeadersLastHeaderTime.getHours() - 2
  );

  const mockIsSPV = (sel.isSPV = jest.fn(() => false));
  const mockStakeTransactions = (sel.stakeTransactions = jest.fn(() => []));
  const mockGetSelectedWallet = (sel.getSelectedWallet = jest.fn(() => {
    return {};
  }));
  const mockSyncFetchHeadersLastHeaderTime = (sel.syncFetchHeadersLastHeaderTime = jest.fn(
    () => testSyncFetchHeadersLastHeaderTime
  ));

  let mockGetCurrentBlockCount = (sel.getCurrentBlockCount = jest.fn(
    () => testCurrentBlockCount
  ));
  const mockGetNeededBlocks = (sel.getNeededBlocks = jest.fn(
    () => testNeededBlocks
  ));
  const mockGetEstimatedTimeLeft = (sel.getEstimatedTimeLeft = jest.fn(
    () => 3113
  ));

  const checkLinearProgressBoxes = (expectedWidth, expectedBoxCount) => {
    mockGetCurrentBlockCount = sel.getCurrentBlockCount = jest.fn(
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
    const textElement = screen.getByText(testProps.text);
    expect(textElement.previousSibling.childNodes.length).toBe(
      expectedBoxCount
    );
    const linearProgressBar = textElement.previousSibling.previousSibling;
    expect(linearProgressBar).toHaveClass("linearProgressBar");
    expect(linearProgressBar).toHaveStyle(`width: ${expectedWidth}%;`);
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
  expect(screen.getByText(testProps.text)).toHaveClass(
    `linearProgressText ${testProps.animationType}`
  );
  checkLinearProgressBoxes(0, 0);

  /* increase current block count */
  testCurrentBlockCount = 100267;
  checkLinearProgressBoxes(20.653976323535773, 1);

  /* increase current block count */
  testCurrentBlockCount = 190267;
  checkLinearProgressBoxes(39.19305567285529, 2);

  /* increase current block count */
  testCurrentBlockCount = 290267;
  checkLinearProgressBoxes(59.79203272765474, 3);

  /* increase current block count */
  testCurrentBlockCount = 350267;
  checkLinearProgressBoxes(72.15141896053441, 4);

  /* increase current block count */
  testCurrentBlockCount = 400267;
  checkLinearProgressBoxes(82.45090748793415, 5);

  /* increase current block count */
  testCurrentBlockCount = 460267;
  checkLinearProgressBoxes(94.81029372081382, 6);

  /* increase current block count */
  testCurrentBlockCount = testNeededBlocks;
  checkLinearProgressBoxes(100, 0);

  // test error mode
  rerender(<AnimatedLinearProgressFull error={true} {...testProps} />);
  expect(
    screen.getByText(testProps.text).previousSibling.previousSibling
  ).toHaveClass("linearProgressBar error");

  mockIsSPV.mockRestore();
  mockGetNeededBlocks.mockRestore();
  mockGetEstimatedTimeLeft.mockRestore();
  mockGetCurrentBlockCount.mockRestore();
  mockSyncFetchHeadersLastHeaderTime.mockRestore();
  mockGetSelectedWallet.mockRestore();
});

test("dcrwallet log line is shown or log the error to console", async () => {
  jest.useFakeTimers();

  const mockIsSPV = (sel.isSPV = jest.fn(() => false));
  const mockGetSelectedWallet = (sel.getSelectedWallet = jest.fn(() => true));
  const mockGetCurrentBlockCount = (sel.getCurrentBlockCount = jest.fn(
    () => 0
  ));
  const mockGetNeededBlocks = (sel.getNeededBlocks = jest.fn(() => 0));
  const mockGetEstimatedTimeLeft = (sel.getEstimatedTimeLeft = jest.fn(
    () => 0
  ));
  const mockConsoleLog = jest
    .spyOn(console, "log")
    .mockImplementation(() => {});

  const testDcrwalletLogLine = "testDcrwalletLogLine";
  let mockGetDcrwalletLogs = (da.getDcrwalletLogs = jest.fn(() => () =>
    Promise.resolve(testDcrwalletLogLine)
  ));

  const mockGetDcrdLastLineLogs = (da.getDcrdLastLineLogs = jest.fn(() => () =>
    Promise.reject()
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
  mockGetDcrwalletLogs = da.getDcrwalletLogs = jest.fn(() => () =>
    Promise.reject()
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
  const mockIsSPV = (sel.isSPV = jest.fn(() => false));
  const mockGetDaemonSynced = (sel.getDaemonSynced = jest.fn(() => true));
  const { rerender } = render(<AnimatedLinearProgressFull {...testProps} />);

  const textElement = screen.getByText(testProps.text);
  expect(textElement).toHaveClass(
    `linearProgressText ${testProps.animationType}`
  );
  expect(textElement.previousSibling).toHaveStyle("");
  expect(textElement.previousSibling).toHaveClass("linearProgressBar");

  // test error mode
  rerender(<AnimatedLinearProgressFull error={true} {...testProps} />);
  expect(screen.getByText(testProps.text).previousSibling).toHaveClass(
    "linearProgressBar error"
  );

  mockIsSPV.mockRestore();
  mockGetDaemonSynced.mockRestore();
});

test("tests when isSPV is true", () => {
  const mockIsSPV = (sel.isSPV = jest.fn(() => true));
  const mockGetDaemonSynced = (sel.getDaemonSynced = jest.fn(() => false));

  const { rerender } = render(<AnimatedLinearProgressFull {...testProps} />);

  const textElement = screen.getByText(testProps.text);
  expect(textElement).toHaveClass(
    `linearProgressText ${testProps.animationType}`
  );
  expect(textElement.previousSibling).toHaveStyle("");
  expect(textElement.previousSibling).toHaveClass("linearProgressBar");

  // test error mode
  rerender(<AnimatedLinearProgressFull error={true} {...testProps} />);
  expect(screen.getByText(testProps.text).previousSibling).toHaveClass(
    "linearProgressBar error"
  );

  mockIsSPV.mockRestore();
  mockGetDaemonSynced.mockRestore();
});

test("receiving null `estimatedTimeLeft` does no shows `Time from last fetched header` label", () => {
  const mockGetEstimatedTimeLeft = (sel.getEstimatedTimeLeft = jest.fn(
    () => null
  ));
  render(<AnimatedLinearProgressFull {...testProps} />);
  expect(
    screen.queryByText(/Time from last fetched header:/i)
  ).not.toBeInTheDocument();
  mockGetEstimatedTimeLeft.mockRestore();
});
