import { Balance } from "shared/Balance";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const testDisplay = (currency, amount, display) => {
  const mockClick = jest.fn(() => {});
  render(
    <Balance currencyDisplay={currency} amount={amount} onClick={mockClick} />
  );

  const balanceNode = screen.getByText(currency).parentElement;
  expect(balanceNode.textContent).toBe(`${display} ${currency}`);

  user.click(balanceNode);
  expect(mockClick).toHaveBeenCalled();
};

test.each([
  ["atoms", null, "0"],
  ["atoms", undefined, "0"],
  ["atoms", 42, "42"],
  ["atoms", 420, "420"],
  ["atoms", 4201, "4,201"],
  ["atoms", 420000001, "420,000,001"],
  ["DCR", null, "0.00000"],
  ["DCR", undefined, "0.00000"],
  ["DCR", 42, "0.00000042"],
  ["DCR", 420000001, "4.20000001"],
  ["DCR", 420000001323, "4,200.00001323"]
])("(%s) %s display '%s'", testDisplay);
