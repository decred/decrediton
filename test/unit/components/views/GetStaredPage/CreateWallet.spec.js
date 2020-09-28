import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { SEED_WORDS } from "wallet/seed";

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
let mockDecodeSeed;

const testSeedArray = SEED_WORDS.slice(0, 33);
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
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.reject("DECODE_ERROR")
  );
});

const goToCopySeedView = async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);

  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
};

const goToConfirmView = async () => {
  await goToCopySeedView();
  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText("Confirm Seed Key"));
};

test("test copy seed view", async () => {
  await goToCopySeedView();

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
  expect(confirmSeedCopyButton).toHaveAttribute("disabled");

  const inputControl = screen.getByRole("textbox");
  user.type(inputControl, "some random text");
  expect(confirmSeedCopyButton).toHaveAttribute("disabled");

  user.clear(inputControl);
  user.type(inputControl, "I understand the risks");
  expect(confirmSeedCopyButton).not.toHaveAttribute("disabled");

  user.click(confirmSeedCopyButton);
  expect(mockCopySeedToClipboard).toHaveBeenCalledWith(testSeedMnemonic);
});

const fillSeedWordEntry = (index, word) => {
  console.log({ index, word });
  const combobox = screen.getByText(`${index + 1}.`).nextSibling.firstChild
    .firstChild.firstChild;
  user.click(combobox);
  user.type(combobox, word);
  user.click(screen.getByRole("option", { name: word }));
};

test("test confirm seed view", async () => {
  await goToConfirmView();

  const createWalletButton = screen.getByText(/create wallet/i);
  expect(createWalletButton).toHaveAttribute("disabled");

  let savedInvalidInputIndex;
  let savedValidSeedWord;
  testSeedArray.map((word, i) => {
    if (!screen.queryByText(word)) {
      if (!savedInvalidInputIndex) {
        // type one invalid seed word
        savedInvalidInputIndex = i;
        savedValidSeedWord = word;
        const invalidSeedWord = SEED_WORDS[SEED_WORDS.length - 1];
        fillSeedWordEntry(i, invalidSeedWord);
      } else {
        fillSeedWordEntry(i, word);
      }
    }
  });
  expect(mockDecodeSeed).not.toHaveBeenCalled();
  // fix invalid seed word
  fillSeedWordEntry(savedInvalidInputIndex, savedValidSeedWord);
  expect(mockDecodeSeed).toHaveBeenCalledWith(testSeedMnemonic);

  const testPassword = "test-password";
  const privatePassphraseInput = screen.getByPlaceholderText(
    "Private Passphrase"
  );
  const repeatPrivatePassphraseInput = screen.getByPlaceholderText(
    "Confirm Private Passphrase"
  );
  fireEvent.change(privatePassphraseInput, {
    target: { value: testPassword }
  });
  fireEvent.change(repeatPrivatePassphraseInput, {
    target: { value: `mistyped ${testPassword}` }
  });
  await wait(() => screen.getByText(/passphrases do not match/i));
  user.clear(repeatPrivatePassphraseInput);
  fireEvent.change(repeatPrivatePassphraseInput, {
    target: { value: testPassword }
  });

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testSeedArray
    })
  );
  // trigger decode again by entering saved seed word again
  fillSeedWordEntry(savedInvalidInputIndex, savedValidSeedWord);
  expect(mockDecodeSeed).toHaveBeenCalledWith(testSeedMnemonic);

  await wait(() => expect(createWalletButton).not.toHaveAttribute("disabled"));

  user.click(createWalletButton);
  expect(mockCreateWallet).toHaveBeenCalled();
}, 30000);
