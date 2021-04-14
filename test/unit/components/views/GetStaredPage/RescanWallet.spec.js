import RescanWallet from "components/views/GetStartedPage/RescanWallet/RescanWallet";
import { render } from "test-utils.js";
import * as sel from "selectors";
import { screen } from "@testing-library/react";

const testStartBlock = 22;
const testEndBlock = 66;
const testCurrentBlock = 55;
const selectors = sel;

let mockRescanStartBlock;
let mockRescanEndBlock;
let mockRescanCurrentBlock;

beforeEach(() => {
  mockRescanStartBlock = selectors.rescanStartBlock = jest.fn(
    () => testStartBlock
  );
  mockRescanEndBlock = selectors.rescanEndBlock = jest.fn(() => testEndBlock);
  mockRescanCurrentBlock = selectors.rescanCurrentBlock = jest.fn(
    () => testCurrentBlock
  );
});

test("test RescanWallet", () => {
  render(<RescanWallet />);
  expect(mockRescanStartBlock).toHaveBeenCalled();
  expect(mockRescanEndBlock).toHaveBeenCalled();
  expect(mockRescanCurrentBlock).toHaveBeenCalled();

  expect(screen.getByText(/rescan progress/i).textContent).toBe(
    `Rescan Progress (${testCurrentBlock} / ${testEndBlock})`
  );
});

test("test if startBlock is larger than currentBlock", () => {
  const testLargerStartBlock = 56;
  mockRescanStartBlock = selectors.rescanStartBlock = jest.fn(
    () => testLargerStartBlock
  );
  render(<RescanWallet />);

  expect(screen.getByText(/rescan progress/i).textContent).toBe(
    `Rescan Progress (${testLargerStartBlock} / ${testEndBlock})`
  );
});
