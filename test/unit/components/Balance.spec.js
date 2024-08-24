import { Balance } from "shared/Balance";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { DCR, ATOMS } from "constants";
import * as sel from "selectors";

// Mock currencyDisplay redux selector used in useBalance which is consumed by
// the Balance component.
let mockCurrencyDisplay;

const selectors = sel;

selectors.currencyDisplay = jest.fn(() => mockCurrencyDisplay);

const testDisplay = (currency, amount, display) => {
  mockCurrencyDisplay = currency;
  render(<Balance amount={amount} />);
  expect(screen.getByText(currency).parentElement.textContent).toBe(
    `${display} ${currency}`
  );
};

test.each([
  [ATOMS, null, "0"],
  [ATOMS, undefined, "0"],
  [ATOMS, 42, "42"],
  [ATOMS, 420, "420"],
  [ATOMS, 4201, "4,201"],
  [ATOMS, 420000001, "420,000,001"],
  [ATOMS, 11039997470, "11,039,997,470"],
  [DCR, null, "0.00000"],
  [DCR, undefined, "0.00000"],
  [DCR, 42, "0.00000042"],
  [DCR, 420000001, "4.20000001"],
  [DCR, 420000001323, "4,200.00001323"]
])("(%s) %s display '%s'", testDisplay);

test("test click on atom balance", async () => {
  const mockClick = jest.fn(() => {});
  mockCurrencyDisplay = ATOMS;
  render(<Balance amount="42" onClick={mockClick} />);
  await user.click(screen.getByText("42").parentElement);
  expect(mockClick).toHaveBeenCalled();
});

test("test click on DCR balance", async () => {
  const mockClick = jest.fn(() => {});
  mockCurrencyDisplay = DCR;
  render(<Balance amount="420000001" onClick={mockClick} />);
  await user.click(screen.getByText("4.20").parentElement);
  expect(mockClick).toHaveBeenCalled();
});

test("test default balance format", () => {
  mockCurrencyDisplay = DCR;
  render(<Balance amount="420000001" />);
  expect(screen.getByText("000001").className).toMatch(/small/i);
  expect(screen.getByText(DCR).className).toMatch(/small/i);
});

test("test large balance format", () => {
  mockCurrencyDisplay = DCR;
  render(<Balance amount="420000001" large />);
  expect(screen.getByText("000001").className).toMatch(/tiny/i);
  expect(screen.getByText(DCR).className).toMatch(/tiny/i);
});

test("test flat balance format", () => {
  mockCurrencyDisplay = DCR;
  render(<Balance amount="420000001" flat />);
  expect(screen.getByText("000001").className).toMatch(/base/i);
  expect(screen.getByText(DCR).className).toMatch(/base/i);
});

test("test title balance format", () => {
  mockCurrencyDisplay = DCR;
  render(<Balance amount="420000001" title />);
  expect(screen.getByText("000001").className).toMatch(/title/i);
  expect(screen.getByText(DCR).className).toMatch(/title/i);
});

test("test bold format on DCR balance", () => {
  mockCurrencyDisplay = DCR;
  render(<Balance amount="420000001" bold />);
  expect(screen.getByText("4.20").className).toMatch(/bold/i);
  expect(screen.getByText("000001").className).toMatch(/bold/i);
});

test("test bold format on atoms balance", () => {
  mockCurrencyDisplay = ATOMS;
  render(<Balance amount="42" bold />);
  expect(screen.getByText("42").className).toMatch(/bold/i);
});

test("test if the amount is prescaled on DCR balance", () => {
  mockCurrencyDisplay = DCR;
  render(<Balance amount="42" preScaled />);
  expect(screen.getByText(DCR).parentElement.textContent).toBe("42.00000 DCR");
});
