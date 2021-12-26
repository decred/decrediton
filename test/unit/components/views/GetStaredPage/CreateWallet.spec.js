import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent, createEvent } from "@testing-library/react";
import { SEED_WORDS } from "constants/seed";
import { POSITION_ERROR, MISMATCH_ERROR } from "constants";
import {
  getSeedWordsArr,
  verifySeedWordsArr,
  selectedSeedWordsCount
} from "components/views/GetStartedPage/CreateWalletPage/ConfirmSeed/utils.js";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as ca from "actions/ClientActions";
import * as wl from "wallet";
jest.mock("electron");

const testWalletName = "test-wallet-name";
const testSelectedWallet = {
  label: testWalletName,
  value: {
    isNew: true,
    isTrezor: false,
    isWatchingOnly: false,
    network: "mainnet",
    wallet: testWalletName,
    gapLimit: null,
    disableCoinTypeUpgrades: false
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

const selectors = sel;
const wlActions = wla;
const daemonActions = da;
const clientActions = ca;
const wallet = wl;

const testSeedArray = SEED_WORDS.slice(0, 33);
const testSeedMnemonic = testSeedArray.join(" ");
const testTooShortHexSeed = "a".repeat(31);
const testShortHexSeed = "b".repeat(32);
const testCompatibleHexSeed = "c".repeat(64);
const testOddHexSeed = "c".repeat(63);
const testInvalidCharHexSeed = "c".repeat(63) + "w";
const testTooLongHexSeed = "d".repeat(129);
const testMaxHexSeed = "e".repeat(128);
const testCreateWalletRequestErrorMsg = "create-wallet-request-error-msg";

beforeEach(() => {
  selectors.getDaemonSynced = jest.fn(() => true);
  selectors.isSPV = jest.fn(() => false);
  wlActions.getSelectedWallet = jest.fn(() => () => null);
  mockCreateWallet = daemonActions.createWallet = jest.fn(() => () =>
    Promise.resolve(testSelectedWallet)
  );
  mockCreateWalletRequest = wlActions.createWalletRequest = jest.fn(() => () =>
    Promise.reject(testCreateWalletRequestErrorMsg)
  );

  mockGenerateSeed = wlActions.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      seedMnemonic: testSeedMnemonic
    })
  );
  mockCancelCreateWallet = wlActions.cancelCreateWallet = jest.fn(() => () =>
    Promise.resolve()
  );
  selectors.maxWalletCount = jest.fn(() => 3);
  mockCopySeedToClipboard = clientActions.copySeedToClipboard = jest.fn(
    () => () => true
  );
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({ toString: () => "DECODE_ERROR" })
  );
  mockClipboardReadText = wallet.readFromClipboard.mockImplementation(
    () => testSeedMnemonic
  );
  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  selectors.stakeTransactions = jest.fn(() => []);
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
  await wait(() => screen.getByText("Seed phrase verification"));
};

const goToRestoreView = async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText("Welcome to Decrediton Wallet"));
  user.click(screen.getByText("Restore Existing Wallet"));
  await wait(() => screen.getByText("Wallet Name"));
  user.type(screen.getByPlaceholderText("Choose a Name"), testWalletName);
};

const goToExistingSeedView = async () => {
  await goToRestoreView();
  user.click(screen.getByText("Continue"));
  await wait(() => screen.getByText("Confirm Seed Key"));
};

const testPrivatePassphraseInputs = async (
  privatePassphraseInput,
  repeatPrivatePassphraseInput,
  mistypeFirst = false
) => {
  const testPassword = "test-password";
  if (!privatePassphraseInput) {
    privatePassphraseInput = screen.getByPlaceholderText(
      "Write your Private Passphrase"
    );
  }
  if (!repeatPrivatePassphraseInput) {
    repeatPrivatePassphraseInput = screen.getByPlaceholderText(
      "Confirm your Private Passphrase"
    );
  }
  fireEvent.change(privatePassphraseInput, {
    target: { value: testPassword }
  });

  if (mistypeFirst) {
    fireEvent.change(repeatPrivatePassphraseInput, {
      target: { value: `mistyped ${testPassword}` }
    });
    await wait(() => screen.getByText(/passphrases do not match/i));
    user.clear(repeatPrivatePassphraseInput);
  }
  fireEvent.change(repeatPrivatePassphraseInput, {
    target: { value: testPassword }
  });
  expect(screen.getByText("Repeated correctly"));
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

const fillSeedWordEntryUsingEnterKey = (combobox, word) => {
  user.click(combobox);
  user.type(combobox, word);
  fireEvent.keyDown(combobox, { key: "Enter", code: "Enter", charCode: 13 });
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
  expect(confirmSeedCopyButton.disabled).toBe(true);

  const inputControl = screen.getByRole("textbox");
  user.type(inputControl, "some random text");
  expect(confirmSeedCopyButton.disabled).toBe(true);

  user.clear(inputControl);
  user.type(inputControl, "I understand the risks");
  expect(confirmSeedCopyButton.disabled).toBe(false);

  user.click(confirmSeedCopyButton);
  expect(mockCopySeedToClipboard).toHaveBeenCalledWith(testSeedMnemonic);
});

const clickOnSeedButton = async (i, clickToTheFake) => {
  const word = testSeedArray[i];
  const buttons = screen.getByText(`Word #${i + 1}`).nextElementSibling
    .children;
  let foundTheButton = false;
  let index = 0;
  while (!foundTheButton && buttons[index] !== undefined) {
    if (!clickToTheFake) {
      if (buttons[index].textContent === word) {
        foundTheButton = true;
        user.click(buttons[index]);
        await wait(() => expect(buttons[index].disabled).toBeTruthy());
      } else {
        index++;
      }
    } else if (buttons[index].textContent !== word) {
      foundTheButton = true;
      user.click(buttons[index]);
      await wait(() => expect(buttons[index].disabled).toBeTruthy());
    } else {
      index++;
    }

    expect(buttons[index] !== undefined).toBeTruthy();
  }
  return buttons[index];
};

test("test confim seed view", async () => {
  await goToConfirmView();

  const createWalletButton = screen.getByText(/create wallet/i);
  expect(createWalletButton.disabled).toBeTruthy();

  for (let i = 0; i < testSeedArray.length; i++) {
    if (i < testSeedArray.length - 1) {
      const button = await clickOnSeedButton(i, false);
      expect(screen.getByText("*Please enter all words")).toBeInTheDocument();
      expect(button.className).not.toMatch("invalid");
    } else {
      // click to the right word except the last one
      const button = await clickOnSeedButton(i, true);
      expect(button.className).toMatch("invalid");
    }
    expect(mockDecodeSeed).not.toHaveBeenCalled();
  }
  expect(createWalletButton.disabled).toBeTruthy();
  await testPrivatePassphraseInputs();
  expect(createWalletButton.disabled).toBeTruthy();
  expect(
    screen.getByText(
      "Some words from the seed are incorrect. Please, choose the right ones to continue."
    )
  ).toBeInTheDocument();

  // fix invalid seed word, decode with error
  await clickOnSeedButton(testSeedArray.length - 1, false);
  expect(mockDecodeSeed).toHaveBeenCalledWith(testSeedMnemonic);
  expect(createWalletButton.disabled).toBeTruthy();

  // fix invalid seed word, decode with success
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );
  await clickOnSeedButton(testSeedArray.length - 1, true);
  await clickOnSeedButton(testSeedArray.length - 1, false);
  expect(mockDecodeSeed).toHaveBeenCalledWith(testSeedMnemonic);
  expect(createWalletButton.disabled).toBeFalsy();

  user.click(createWalletButton);
  await wait(() => expect(mockCreateWallet).toHaveBeenCalled());
});

test("test confirm seed view in testnet mode (allows verification skip in dev)", async () => {
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);
  mockGenerateSeed = wlActions.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      seedMnemonic: testSeedMnemonic,
      seedBytes: 1
    })
  );
  await goToConfirmView();

  const createWalletButton = screen.getByText(/create wallet/i);
  await testPrivatePassphraseInputs();

  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );

  await wait(() => expect(createWalletButton.disabled).toBe(false));
  user.click(createWalletButton);
  expect(mockCreateWallet).toHaveBeenCalled();
  expect(mockIsTestNet).toHaveBeenCalled();
});

test("test typing a valid seed word on existing seed view", async () => {
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );
  await goToExistingSeedView();

  const createWalletButton = screen.getByText(/create wallet/i);
  expect(createWalletButton.disabled).toBe(true);

  const comboboxArray = screen.getAllByRole("combobox");
  expect(comboboxArray.length).toBe(testSeedArray.length);

  fillSeedWordEntryUsingEnterKey(comboboxArray[0], testSeedArray[0]);
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
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({ toString: () => MISMATCH_ERROR })
  );
  await goToExistingSeedView();

  firePasteEvent(screen.getAllByRole("combobox")[0], testSeedMnemonic);
  await wait(() => screen.getByText(/Error: seed is not valid./i));
});

test("pasting valid seed words on existing seed view and receive create wallet request error", async () => {
  mockCreateWalletRequest = wlActions.createWalletRequest = jest.fn(() => () =>
    Promise.reject(testCreateWalletRequestErrorMsg)
  );
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
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

  // expect to jump back to the wallet choose view, and display
  // the error msg received from createWalletRequest
  await wait(() => screen.getByText(testCreateWalletRequestErrorMsg));
  screen.getByText(/choose a wallet to open/i);
});

test("pasting valid seed words on existing seed view and successfully create wallet", async () => {
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );
  mockCreateWalletRequest = wlActions.createWalletRequest = jest.fn(() => () =>
    Promise.resolve(true)
  );
  await goToExistingSeedView();

  firePasteEvent(screen.getAllByRole("combobox")[0], testSeedMnemonic);

  await wait(() =>
    screen.getByText(
      /please make sure you also have a physical, written down copy of your seed./i
    )
  );
  const privatePassphraseInput = screen.getByPlaceholderText(
    "Write your Private Passphrase"
  );
  const repeatPrivatePassphraseInput = screen.getByPlaceholderText(
    "Confirm your Private Passphrase"
  );
  await testPrivatePassphraseInputs(
    privatePassphraseInput,
    repeatPrivatePassphraseInput,
    true
  );

  user.click(screen.getByText(/create wallet/i));
  expect(mockCreateWallet).toHaveBeenCalled();
  expect(mockCreateWalletRequest).toHaveBeenCalled();
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("create wallet button must be disabled if any of the inputs is invalid", async () => {
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );
  mockCreateWalletRequest = wlActions.createWalletRequest = jest.fn(() => () =>
    Promise.resolve(true)
  );
  await goToExistingSeedView();

  firePasteEvent(screen.getAllByRole("combobox")[0], testSeedMnemonic);

  await wait(() =>
    screen.getByText(
      "*Please make sure you also have a physical, written down copy of your seed."
    )
  );
  const privatePassphraseInput = screen.getByPlaceholderText(
    "Write your Private Passphrase"
  );
  const repeatPrivatePassphraseInput = screen.getByPlaceholderText(
    "Confirm your Private Passphrase"
  );
  const createWallet = screen.getByText("Create Wallet");
  await testPrivatePassphraseInputs(
    privatePassphraseInput,
    repeatPrivatePassphraseInput
  );
  expect(createWallet.disabled).toBe(false);

  // differentiate passphrases
  user.type(repeatPrivatePassphraseInput, "plus-string");
  screen.getByText("*Passphrases do not match");
  expect(createWallet.disabled).toBe(true);
  // fix, button should be enabled
  user.clear(privatePassphraseInput);
  user.clear(repeatPrivatePassphraseInput);
  await testPrivatePassphraseInputs(
    privatePassphraseInput,
    repeatPrivatePassphraseInput
  );
  expect(createWallet.disabled).toBe(false);

  // clear passphrases
  user.clear(privatePassphraseInput);
  user.clear(repeatPrivatePassphraseInput);
  screen.getByText("*Please enter your private passphrase");
  expect(createWallet.disabled).toBe(true);

  // fix, button should be enabled
  user.clear(privatePassphraseInput);
  user.clear(repeatPrivatePassphraseInput);
  await testPrivatePassphraseInputs(
    privatePassphraseInput,
    repeatPrivatePassphraseInput
  );
  expect(createWallet.disabled).toBe(false);
});

test("create wallet button must be disabled if any of the inputs is invalid", async () => {
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );
  mockCreateWalletRequest = wlActions.createWalletRequest = jest.fn(() => () =>
    Promise.resolve(true)
  );
  await goToExistingSeedView();

  const comboboxArray = screen.getAllByRole("combobox");
  firePasteEvent(comboboxArray[0], testSeedMnemonic);

  await wait(() =>
    screen.getByText(
      "*Please make sure you also have a physical, written down copy of your seed."
    )
  );
  const privatePassphraseInput = screen.getByPlaceholderText(
    "Write your Private Passphrase"
  );
  const repeatPrivatePassphraseInput = screen.getByPlaceholderText(
    "Confirm your Private Passphrase"
  );
  const createWallet = screen.getByText("Create Wallet");
  await testPrivatePassphraseInputs(
    privatePassphraseInput,
    repeatPrivatePassphraseInput
  );
  expect(createWallet.disabled).toBe(false);

  // enter invalid seed word into the first input, button should be disabled
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({})
  );
  fillSeedWordEntryUsingEnterKey(comboboxArray[0], testSeedArray[1]);
  await wait(() => expect(createWallet).toHaveAttribute("disabled"));

  // fix, button should be enabled
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testSeedArray
    })
  );
  fillSeedWordEntryUsingEnterKey(comboboxArray[0], testSeedArray[0]);
  await wait(() => expect(createWallet).not.toHaveAttribute("disabled"));
});

test("test POSITION_ERROR handling on restore view", async () => {
  await goToExistingSeedView();

  // reject with an empty error object
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({})
  );
  const comboboxArray = screen.getAllByRole("combobox");
  fillSeedWordEntryUsingEnterKey(comboboxArray[0], testSeedArray[0]);
  expect(screen.getByText("1.").parentNode.className).toMatch(/populated/);
  fillSeedWordEntryUsingEnterKey(comboboxArray[1], testSeedArray[1]);
  expect(screen.getByText("2.").parentNode.className).toMatch(/populated/);

  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({
      toString: () => `is ${POSITION_ERROR} 2, check for missing words`
    })
  );
  fillSeedWordEntryUsingEnterKey(comboboxArray[2], testSeedArray[2]);
  await wait(() =>
    expect(screen.getByText("3.").parentNode.className).toMatch(/error/)
  );

  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({ details: MISMATCH_ERROR })
  );
  fillSeedWordEntryUsingEnterKey(comboboxArray[4], testSeedArray[4]);
  await wait(() =>
    expect(screen.getByText("5.").parentNode.className).toMatch(/populated/)
  );

  // if entered the same word, the decodeSeed should not be called
  mockDecodeSeed.mockClear();
  fillSeedWordEntryUsingEnterKey(comboboxArray[4], testSeedArray[4]);
  expect(mockDecodeSeed).not.toHaveBeenCalled();

  fillSeedWordEntryUsingEnterKey(comboboxArray[5], testSeedArray[5]);
  await wait(() =>
    expect(screen.getByText("6.").parentNode.className).toMatch(/populated/)
  );
});

test("test invalid POSITION_ERROR msg format handling on restore view", async () => {
  await goToExistingSeedView();

  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({
      details: `is ${POSITION_ERROR} at 4, check for missing words`
    })
  );
  const comboboxArray = screen.getAllByRole("combobox");
  fillSeedWordEntryUsingEnterKey(comboboxArray[0], testSeedArray[0]);
  fillSeedWordEntryUsingEnterKey(comboboxArray[1], testSeedArray[1]);
  fillSeedWordEntryUsingEnterKey(comboboxArray[3], testSeedArray[3]);
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
    "Invalid hex seed. Hex seeds need to be between 32 and 128 characters long.";
  const hexSeedWarningMsg =
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
  expect(screen.queryByText(hexSeedWarningMsg)).not.toBeInTheDocument();

  // Next tests will require some return value from the mock getDecodedSeed.
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.resolve({
      decodedSeed: testCompatibleHexSeed
    })
  );

  // Test valid (but short, incompatible) hex seed.
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testShortHexSeed }
  });
  await wait(() => expect(mockDecodeSeed).toHaveBeenCalled());
  expect(screen.queryByText(hexSeedErrorMsg)).not.toBeInTheDocument();
  expect(screen.getByText(hexSeedWarningMsg)).toBeInTheDocument();

  // Test valid and compatible hex seed
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testCompatibleHexSeed }
  });
  await wait(() => expect(mockDecodeSeed).toHaveBeenCalled());
  expect(screen.queryByText(hexSeedErrorMsg)).not.toBeInTheDocument();
  expect(screen.queryByText(hexSeedWarningMsg)).not.toBeInTheDocument();

  // Test valid hex seed with max chars
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testMaxHexSeed }
  });
  await wait(() => expect(mockDecodeSeed).toHaveBeenCalled());
  expect(screen.queryByText(hexSeedErrorMsg)).not.toBeInTheDocument();
  expect(screen.getByText(hexSeedWarningMsg)).toBeInTheDocument();

  // The next tests all assume a failed decode.
  mockDecodeSeed = wlActions.decodeSeed = jest.fn(() => () =>
    Promise.reject({})
  );

  // Test too long hex seed.
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testTooLongHexSeed }
  });
  expect(screen.getByText(hexSeedErrorMsg)).toBeInTheDocument();
  expect(screen.queryByText(hexSeedWarningMsg)).not.toBeInTheDocument();
  expect(hexInput.value).toMatch("");

  // Test hex seed with odd number of characters.
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testOddHexSeed }
  });
  expect(screen.getByText(hexSeedErrorMsg)).toBeInTheDocument();
  expect(screen.queryByText(hexSeedWarningMsg)).not.toBeInTheDocument();
  expect(hexInput.value).toMatch("");

  // Test hex seed with invalid character.
  user.clear(hexInput);
  fireEvent.change(hexInput, {
    target: { value: testInvalidCharHexSeed }
  });
  expect(screen.getByText(hexSeedErrorMsg)).toBeInTheDocument();
  expect(screen.queryByText(hexSeedWarningMsg)).not.toBeInTheDocument();
  expect(hexInput.value).toMatch("");
});

test("space button should be disabled on seed combobox", async () => {
  await goToExistingSeedView();

  const combobox = screen.getAllByRole("combobox")[0];
  user.click(combobox);
  user.type(combobox, testSeedArray[0].charAt(0));
  expect(combobox.value).toMatch(testSeedArray[0].charAt(0));
  user.type(combobox, " ");
  expect(combobox.value).toMatch(testSeedArray[0].charAt(0));
});

const getComboboxByName = (name) => {
  const regex = new RegExp("singleValue", "g");
  const options = screen
    .getAllByText(name)
    .filter((option) => option.className.match(regex));
  return options[0];
};

test("middle mouse button down and paste on seed combobox", async () => {
  await goToExistingSeedView();

  const combobox = screen.getAllByRole("combobox")[0];
  fireEvent.mouseDown(combobox, { which: 2 });
  await wait(() => expect(mockClipboardReadText).toHaveBeenCalled());
  for (let i = 0; i < testSeedArray.length; i++) {
    expect(getComboboxByName(testSeedArray[i])).toBeInTheDocument();
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

test("test back button on confirm view", async () => {
  await goToConfirmView();

  user.click(screen.getByText("Back"));
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
});

test("test go back button on existing seed view", async () => {
  await goToExistingSeedView();

  user.click(screen.getByText(/go back/i).nextElementSibling);
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test go back button on copy seed view", async () => {
  await goToCopySeedView();

  user.click(screen.getByText(/go back/i).nextElementSibling);
  await wait(() =>
    expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument()
  );
});

test("test getSeedWords and verifySeedWordsArr function", () => {
  const testSeedArray = testSeedMnemonic.split(" ");
  const seedWordsArr = getSeedWordsArr(testSeedMnemonic);
  expect(testSeedArray.length === 33).toBeTruthy();
  expect(seedWordsArr.length === 33).toBeTruthy();

  seedWordsArr.map((obj, i) => {
    expect(obj.word === testSeedArray[i]).toBeTruthy();
    expect(obj.wordsToShow.includes(obj.word)).toBeTruthy();
    expect(obj.wordsToShow.length === 3).toBeTruthy();

    const trueWords = [];
    const fakeWords = [];
    obj.wordsToShow.map((w) => {
      if (w === obj.word) {
        trueWords.push(w);
      } else {
        fakeWords.push(w);
      }
    });
    expect(trueWords.length === 1).toBeTruthy();
    expect(fakeWords.length === 2).toBeTruthy();
  });

  const validSeedWordArr = [...seedWordsArr];

  for (let i = 0; i < validSeedWordArr.length; i++) {
    validSeedWordArr[i].selected = validSeedWordArr[i].wordsToShow.indexOf(
      validSeedWordArr[i].word
    );
    expect(selectedSeedWordsCount(validSeedWordArr)).toBe(i + 1);
  }

  expect(verifySeedWordsArr(testSeedMnemonic, validSeedWordArr)).toBeTruthy();

  validSeedWordArr[0].selected =
    validSeedWordArr[0].wordsToShow.indexOf(validSeedWordArr[0].word) === 0
      ? 1
      : 0;
  expect(verifySeedWordsArr(testSeedMnemonic, validSeedWordArr)).toBeFalsy();
});
