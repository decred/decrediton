import { Balance } from "shared/Balance";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const testDisplay = (currency, amount, display) => {
  render(<Balance currencyDisplay={currency} amount={amount} />);
  expect(screen.getByText(currency).parentElement.textContent).toBe(
    `${display} ${currency}`
  );
};

test.each([
  ["atoms", null, "0"],
  ["atoms", undefined, "0"],
  ["atoms", 42, "42"],
  ["atoms", 420, "420"],
  ["atoms", 4201, "4,201"],
  ["atoms", 420000001, "420,000,001"],
  ["atoms", 11039997470, "11,039,997,470"],
  ["DCR", null, "0.00000"],
  ["DCR", undefined, "0.00000"],
  ["DCR", 42, "0.00000042"],
  ["DCR", 420000001, "4.20000001"],
  ["DCR", 420000001323, "4,200.00001323"]
])("(%s) %s display '%s'", testDisplay);

test("test click on atom balance", () => {
  const mockClick = jest.fn(() => {});
  render(<Balance currencyDisplay="atoms" amount="42" onClick={mockClick} />);
  user.click(screen.getByText("42").parentElement);
  expect(mockClick).toHaveBeenCalled();
});

test("test click on DCR balance", () => {
  const mockClick = jest.fn(() => {});
  render(
    <Balance currencyDisplay="DCR" amount="420000001" onClick={mockClick} />
  );
  user.click(screen.getByText("4.20").parentElement);
  expect(mockClick).toHaveBeenCalled();
});

test("test default balance format", () => {
  render(<Balance currencyDisplay="DCR" amount="420000001" />);
  expect(screen.getByText("000001").className).toMatch(/balance-small/i);
  expect(screen.getByText("DCR").className).toMatch(/balance-small/i);
});

test("test large balance format", () => {
  render(<Balance currencyDisplay="DCR" amount="420000001" large />);
  expect(screen.getByText("000001").className).toMatch(/balance-tiny/i);
  expect(screen.getByText("DCR").className).toMatch(/balance-tiny/i);
});

test("test flat balance format", () => {
  render(<Balance currencyDisplay="DCR" amount="420000001" flat />);
  expect(screen.getByText("000001").className).toMatch(/balance-base/i);
  expect(screen.getByText("DCR").className).toMatch(/balance-base/i);
});

test("test title balance format", () => {
  render(<Balance currencyDisplay="DCR" amount="420000001" title />);
  expect(screen.getByText("000001").className).toMatch(/balance-title/i);
  expect(screen.getByText("DCR").className).toMatch(/balance-title/i);
});

test("test bold format on DCR balance", () => {
  render(<Balance currencyDisplay="DCR" amount="420000001" bold />);
  expect(screen.getByText("4.20").className).toMatch(/bold/i);
  expect(screen.getByText("000001").className).toMatch(/bold/i);
});

test("test bold format on atoms balance", () => {
  render(<Balance currencyDisplay="atoms" amount="42" bold />);
  expect(screen.getByText("42").className).toMatch(/bold/i);
});

test("test if the amount is prescaled on DCR balance", () => {
  render(<Balance currencyDisplay="DCR" amount="42" preScaled />);
  expect(screen.getByText("DCR").parentElement.textContent).toBe(
    "42.00000 DCR"
  );
});
