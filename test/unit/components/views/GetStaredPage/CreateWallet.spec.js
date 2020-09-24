import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";

const testWalletName = "test-wallet-name";
const testSelectedWallet = {
  label: testWalletName,
  value: {
    isNew: true,
    isPrivacy: false,
    isTrezor: false,
    isWatchingOnly: false,
    network: "mainnet",
    wallet: testWalletName
  }
};

let mockCreateWallet;
let mockGenerateSeed;
let mockCopySeedToClipboard;

let testSeedArray = [];
for (let i = 1; i <= 33; i++) {
  testSeedArray.push(`ts-${i}`);
}
const testSeedMnemonic = testSeedArray.join(" ");

beforeEach(() => {
  sel.getDaemonSynced = jest.fn(() => true);
  mockCreateWallet = da.createWallet = jest.fn(() => () =>
    Promise.resolve(testSelectedWallet)
  );
  mockGenerateSeed = wla.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      getSeedMnemonic: () => testSeedMnemonic
    })
  );
  sel.maxWalletCount = jest.fn(() => 3);
  mockCopySeedToClipboard = ca.copySeedToClipboard = jest.fn(() => () => true);
});

test("test copy seed view", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);

  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
  expect(mockCreateWallet).toHaveBeenCalledWith(testSelectedWallet);
  expect(mockGenerateSeed).toHaveBeenCalled();
  testSeedArray.map((word, i) => {
    const seedWordLabel = screen.getByText(word);
    expect(seedWordLabel).toBeInTheDocument();
    expect(seedWordLabel.previousSibling.textContent).toMatch(`${i + 1}.`);
  });
  user.click(screen.getByText(/copy seed words to clipboard/i));
  expect(screen.getByText(/seed clipboard copy warning/i)).toBeInTheDocument();
  // cancel and reopen modal
  user.click(screen.getByRole("button", { name: "Cancel seed copy" }));
  expect(
    screen.queryByText(/seed clipboard copy warning/i)
  ).not.toBeInTheDocument();
  user.click(screen.getByText(/copy seed words to clipboard/i));

  const confirmSeedCopyButton = screen.getByText(/confirm seed copy/i);
  expect(confirmSeedCopyButton).toBeInTheDocument();
  expect(confirmSeedCopyButton).toHaveAttribute('disabled');

  const inputControl = screen.getByRole("textbox");
  user.type(inputControl,"some random text");
  expect(confirmSeedCopyButton).toHaveAttribute('disabled');

  user.clear(inputControl);
  user.type(inputControl,"I understand the risks");
  expect(confirmSeedCopyButton).not.toHaveAttribute('disabled');

  user.click(confirmSeedCopyButton);
  expect(mockCopySeedToClipboard).toHaveBeenCalledWith(testSeedMnemonic);
});
