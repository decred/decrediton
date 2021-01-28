import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent, createEvent } from "@testing-library/react";
import { SEED_WORDS } from "wallet/seed";
import { POSITION_ERROR, MISMATCH_ERROR } from "constants";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";
import { clipboard } from "electron";
jest.mock("electron");

const testWalletName = "test-wallet-name";
const testSelectedWallet = {
  label: testWalletName,
  value: {
    isNew: true,
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
let mockClipboardReadText;
let mockCancelCreateWallet;
let mockCreateWalletRequest;
let mockIsTestNet;

const testSeedArray = SEED_WORDS.slice(0, 33);
const testSeedMnemonic = testSeedArray.join(" ");
const invalidSeedWord = SEED_WORDS[SEED_WORDS.length - 1];
const testTooShortHexSeed = "test-short-seed-string";
const testHexSeed = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const testTooLongHexSeed = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const testCreateWalletRequestErrorMsg = "create-wallet-request-error-msg";

beforeEach(() => {
  sel.getDaemonSynced = jest.fn(() => true);
  sel.isSPV = jest.fn(() => false);
  wla.getSelectedWallet = jest.fn(() => () => null);
  mockCreateWallet = da.createWallet = jest.fn(() => () =>
    Promise.resolve(testSelectedWallet)
  );
  mockCreateWalletRequest = wla.createWalletRequest = jest.fn(() => () =>
    Promise.reject(testCreateWalletRequestErrorMsg)
  );

  mockGenerateSeed = wla.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      getSeedMnemonic: () => testSeedMnemonic
    })
  );
  mockCancelCreateWallet = wla.cancelCreateWallet = jest.fn(() => () =>
    Promise.resolve()
  );
  sel.maxWalletCount = jest.fn(() => 3);
  mockCopySeedToClipboard = ca.copySeedToClipboard = jest.fn(() => () => true);
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.reject({ details: "DECODE_ERROR" })
  );
  mockClipboardReadText = clipboard.readText.mockImplementation(
    () => testSeedMnemonic
  );
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
  sel.stakeTransactions = jest.fn(() => []);
});

const goToCopySeedView = async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText("Wallet Name"));
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);

  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
};

const goToConfirmView = async () => {
  await goToCopySeedView();
  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText("Confirm Seed Key"));
};

const goToRestoreView = async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText("Wallet Name"));
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
};

const goToExistingSeedView = async () => {
  await goToRestoreView();
  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText(/confirm seed key/i));
};

const testPrivatePassphraseInputs = async () => {
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
};

const firePasteEvent = (combobox, text) => {
  const eventProperties = {
    clipboardData: {
      getData: jest.fn().mockReturnValueOnce(text)
    }
  };
  const pasteEvent = createEvent.paste(combobox, eventProperties);
  pasteEvent.clipboardData = eventProperties.clipboardData;
  fireEvent(combobox, pasteEvent);
};

const fillSeedWordEntryUsingSpaceKey = (combobox, word) => {
  user.click(combobox);
  user.type(combobox, word + " ");
};

const fillSeedWordEntryByCLickingOnOption = (combobox, word) => {
  user.click(combobox);
  user.type(combobox, word);
  user.click(screen.getByRole("option", { name: word }));
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

test("test typing a seed word and click on the combobox option on confirm seed view", async () => {
  await goToConfirmView();

  const createWalletButton = screen.getByText(/create wallet/i);
  expect(createWalletButton).toHaveAttribute("disabled");

  const comboboxArray = screen.getAllByRole("combobox");
  let savedInvalidCombobox = null;
  let savedValidSeedWord;
  for (let i = 0; i < comboboxArray.length; i++) {
    const combobox = comboboxArray[i];
    const seedWordIndex = parseInt(
      combobox.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.textContent.replace(
        ".",
        ""
      )
    );
    const word = testSeedArray[seedWordIndex - 1];
    if (savedInvalidCombobox === null) {
      // type one invalid seed word
      savedInvalidCombobox = combobox;
      savedValidSeedWord = word;
      fillSeedWordEntryUsingSpaceKey(combobox, invalidSeedWord);
    } else {
      fillSeedWordEntryUsingSpaceKey(combobox, word);
    }
  }
  expect(mockDecodeSeed).not.toHaveBeenCalled();

  // fix invalid seed word
  fillSeedWordEntryByCLickingOnOption(savedInvalidCombobox, savedValidSeedWord);
  expect(mockDecodeSeed).toHaveBeenCalledWith(testSeedMnemonic);

  await testPrivatePassphraseInputs();

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testSeedArray
    })
  );
  // trigger decode again by entering saved seed word
  fillSeedWordEntryUsingSpaceKey(
    savedInvalidCombobox,
    savedValidSeedWord + " "
  );
  expect(mockDecodeSeed).toHaveBeenCalledWith(testSeedMnemonic);

  await wait(() => expect(createWalletButton).not.toHaveAttribute("disabled"));
  user.click(createWalletButton);
  expect(mockCreateWallet).toHaveBeenCalled();
});

test("test confirm seed view in testnet mode (allows verification skip in dev)", async () => {
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  mockGenerateSeed = wla.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      getSeedMnemonic: () => testSeedMnemonic,
      getSeedBytes: () => 1
    })
  );
  await goToConfirmView();

  const createWalletButton = screen.getByText(/create wallet/i);
  await testPrivatePassphraseInputs();

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testSeedArray
    })
  );

  await wait(() => expect(createWalletButton).not.toHaveAttribute("disabled"));
  user.click(createWalletButton);
  expect(mockCreateWallet).toHaveBeenCalled();
  expect(mockIsTestNet).toHaveBeenCalled();
});

test("test typing a valid seed word on existing seed view", async () => {
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testSeedArray
    })
  );
  await goToExistingSeedView();

  const createWalletButton = screen.getByText(/create wallet/i);
  expect(createWalletButton).toHaveAttribute("disabled");

  const comboboxArray = screen.getAllByRole("combobox");
  expect(comboboxArray.length).toBe(testSeedArray.length);

  fillSeedWordEntryUsingSpaceKey(comboboxArray[0], testSeedArray[0]);
  expect(mockDecodeSeed).toHaveBeenCalled();
  await wait(() =>
    expect(screen.getByText("1.").parentNode.className).toMatch(/populated/)
  );
});

test("pasting just 32 seed words on existing seed view", async () => {
  await goToExistingSeedView();
  const testInvalidSeedArray = testSeedArray.slice(0, 10);
  const testInvalidSeedMnemonic = testInvalidSeedArray.join(" ");

  firePasteEvent(screen.getAllByRole("combobox")[0], testInvalidSeedMnemonic);

  await wait(() => screen.getByText(/please paste a valid 33 word seed./i));
});

test("pasting invalid seed words on existing seed view", async () => {
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.reject({ details: MISMATCH_ERROR })
  );
  await goToExistingSeedView();

  firePasteEvent(screen.getAllByRole("combobox")[0], testSeedMnemonic);
  await wait(() => screen.getByText(/Error: seed is not valid./i));
});

test("pasting valid seed words on existing seed view and receive decode error and create wallet request error", async () => {
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testSeedArray
    })
  );
  await goToExistingSeedView();

  firePasteEvent(screen.getAllByRole("combobox")[0], testSeedMnemonic);

  await wait(() =>
    screen.getByText(
      /please make sure you also have a physical, written down copy of your seed./i
    )
  );
  await testPrivatePassphraseInputs();
  user.click(screen.getByText(/create wallet/i));
  expect(mockCreateWallet).toHaveBeenCalled();
  expect(mockCreateWalletRequest).toHaveBeenCalled();
  await wait(() =>
    expect(screen.getByTestId("decred-loading").style.display).toMatch(/block/i)
  );
});

test("pasting valid seed words on existing seed view and successfully create wallet", async () => {
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testSeedArray
    })
  );
  mockCreateWalletRequest = wla.createWalletRequest = jest.fn(() => () =>
    Promise.resolve(true)
  );
  await goToExistingSeedView();

  firePasteEvent(screen.getAllByRole("combobox")[0], testSeedMnemonic);

  await wait(() =>
    screen.getByText(
      /please make sure you also have a physical, written down copy of your seed./i
    )
  );
  await testPrivatePassphraseInputs();

  user.click(screen.getByText(/create wallet/i));
  expect(mockCreateWallet).toHaveBeenCalled();
  expect(mockCreateWalletRequest).toHaveBeenCalled();
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test POSITION_ERROR handling on restore view", async () => {
  await goToExistingSeedView();

  // reject with an empty error object
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () => Promise.reject({}));
  const comboboxArray = screen.getAllByRole("combobox");
  fillSeedWordEntryUsingSpaceKey(comboboxArray[0], testSeedArray[0]);
  expect(screen.getByText("1.").parentNode.className).toMatch(/populated/);
  fillSeedWordEntryUsingSpaceKey(comboboxArray[1], testSeedArray[1]);
  expect(screen.getByText("2.").parentNode.className).toMatch(/populated/);

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.reject({
      details: `is ${POSITION_ERROR} 2, check for missing words`
    })
  );
  fillSeedWordEntryUsingSpaceKey(comboboxArray[2], testSeedArray[2]);
  await wait(() =>
    expect(screen.getByText("3.").parentNode.className).toMatch(/error/)
  );

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.reject({ details: MISMATCH_ERROR })
  );
  fillSeedWordEntryUsingSpaceKey(comboboxArray[4], testSeedArray[4]);
  await wait(() =>
    expect(screen.getByText("5.").parentNode.className).toMatch(/populated/)
  );

  // if entered the same word, the decodeSeed should not be called
  mockDecodeSeed.mockClear();
  fillSeedWordEntryUsingSpaceKey(comboboxArray[4], testSeedArray[4]);
  expect(mockDecodeSeed).not.toHaveBeenCalled();

  fillSeedWordEntryUsingSpaceKey(comboboxArray[5], testSeedArray[5]);
  await wait(() =>
    expect(screen.getByText("6.").parentNode.className).toMatch(/populated/)
  );
});

test("test invalid POSITION_ERROR msg format handling on restore view", async () => {
  await goToExistingSeedView();

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.reject({
      details: `is ${POSITION_ERROR} at 4, check for missing words`
    })
  );
  const comboboxArray = screen.getAllByRole("combobox");
  fillSeedWordEntryUsingSpaceKey(comboboxArray[0], testSeedArray[0]);
  fillSeedWordEntryUsingSpaceKey(comboboxArray[1], testSeedArray[1]);
  fillSeedWordEntryUsingSpaceKey(comboboxArray[3], testSeedArray[3]);
  await wait(() =>
    expect(screen.getByText("4.").parentNode.className).toMatch(/populated/)
  );
});

test("test hex input tab on restore view", async () => {
  await goToExistingSeedView();

  const wordsTab = screen.getByText("words");
  const hexTab = screen.getByText("hex");
  user.click(hexTab);
  const hexInputPlaceholderText =
    "Enter the hex representation of your seed...";
  const hexSeedErrorMsg =
    "Error: seed is not 32 bytes, such comes from a non-supported software and may have unintended consequences.";
  expect(
    screen.getByPlaceholderText(hexInputPlaceholderText)
  ).toBeInTheDocument();

  // go back to words tab
  user.click(wordsTab);
  expect(
    screen.queryByPlaceholderText(hexInputPlaceholderText)
  ).not.toBeInTheDocument();

  // go back to hex tab again
  user.click(hexTab);
  const hexInput = screen.getByPlaceholderText(hexInputPlaceholderText);
  expect(hexInput).toBeInTheDocument();

  // test too short hex word
  fireEvent.change(hexInput, {
    target: { value: testTooShortHexSeed }
  });
  expect(screen.getByText(hexSeedErrorMsg)).toBeInTheDocument();

  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      getDecodedSeed: () => testHexSeed
    })
  );
  // test valid hex word
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testHexSeed }
  });
  await wait(() => expect(mockDecodeSeed).toHaveBeenCalled());
  expect(screen.queryByText(hexSeedErrorMsg)).not.toBeInTheDocument();

  // test too long hex word
  mockDecodeSeed = wla.decodeSeed = jest.fn(() => () => Promise.reject({}));
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testTooLongHexSeed }
  });
  expect(screen.getByText(hexSeedErrorMsg)).toBeInTheDocument();
  expect(hexInput.value).toMatch("");
});

test("press space button on seed combobox", async () => {
  await goToExistingSeedView();

  const combobox = screen.getAllByRole("combobox")[0];
  user.click(combobox);
  user.type(combobox, testSeedArray[0].charAt(0));
  expect(screen.getByText(testSeedArray[0].charAt(0))).toBeInTheDocument();
  user.type(combobox, " ");
  expect(
    screen.queryByText(testSeedArray[0].charAt(0))
  ).not.toBeInTheDocument();
  expect(screen.getByText(testSeedArray[0])).toBeInTheDocument();
});

test("middle mouse button down and paste on seed combobox", async () => {
  await goToExistingSeedView();

  const combobox = screen.getAllByRole("combobox")[0];
  fireEvent.mouseDown(combobox, { which: 2 });
  await wait(() => expect(mockClipboardReadText).toHaveBeenCalled());
  for (let i = 0; i < testSeedArray.length; i++) {
    expect(screen.getByText(testSeedArray[i])).toBeInTheDocument();
  }
});

test("test cancel button on existing seed view", async () => {
  await goToExistingSeedView();

  user.click(screen.getByText("Cancel"));
  await wait(() => expect(mockCancelCreateWallet).toHaveBeenCalled());
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test cancel button on copy seed view", async () => {
  await goToCopySeedView();

  user.click(screen.getByText("Cancel"));
  await wait(() => expect(mockCancelCreateWallet).toHaveBeenCalled());
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test cancel button on confirm view", async () => {
  await goToConfirmView();

  user.click(screen.getByText("Cancel"));
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
});

test("test go back button on existing seed view", async () => {
  await goToExistingSeedView();

  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test go back button on copy seed view", async () => {
  await goToCopySeedView();

  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test go back button on confirm seed view", async () => {
  await goToConfirmView();

  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
});
