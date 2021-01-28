import SpvChoicePage from "components/views/GetStartedPage/SpvChoicePage/SpvChoicePage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";

let mockIsTestNet;
let mockToggleSpv;

beforeEach(() => {
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
  mockToggleSpv = da.toggleSpv = jest.fn(() => () => {});
  sel.stakeTransactions = jest.fn(() => []);
});

test("render SPV choice page", () => {
  render(<SpvChoicePage />);

  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );

  const spvLabel = screen.getByText(/simple payment verification \(spv\)/i);
  expect(spvLabel).toBeInTheDocument();
  expect(spvLabel.nextSibling.textContent).toMatchInlineSnapshot(
    `"Select how Decrediton should connect to the Decred network. You can change this in the application settings later. For more in-depth information about SPV and how it works, you can go here"`
  );

  const enableSpvLabel = screen.getByText(/enable spv/i);
  expect(enableSpvLabel).toBeInTheDocument();
  expect(enableSpvLabel.nextSibling.textContent).toMatchInlineSnapshot(
    `"SPV will allow your wallets to be restored and used much more quickly.  This speed comes at cost, with blocks not being fully verified.  It's 'less secure' but very unlikely that there will be any problems."`
  );
  user.click(enableSpvLabel);
  expect(mockToggleSpv).toHaveBeenCalledWith(true);
  mockToggleSpv.mockClear();

  const disableSpvLabel = screen.getByText(/disable spv/i);
  expect(disableSpvLabel).toBeInTheDocument();
  expect(disableSpvLabel.nextSibling.textContent).toMatchInlineSnapshot(
    `"This will use the regular Decred daemon and fully verify blocks.  This will take longer but is fully secure.  Any block or mined transaction can be fully trusted."`
  );
  user.click(disableSpvLabel);
  expect(mockToggleSpv).toHaveBeenCalledWith(false);
});

test("render SPV choice page in testnet mode", () => {
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  render(<SpvChoicePage />);
  expect(mockIsTestNet).toHaveBeenCalled();
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
});
