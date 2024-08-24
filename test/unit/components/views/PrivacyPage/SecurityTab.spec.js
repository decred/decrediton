import PrivacyPage from "components/views/PrivacyPage";
import SecurityTab from "components/views/PrivacyPage/SecurityTab";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as trza from "actions/TrezorActions";
import * as cla from "actions/ClientActions";

const selectors = sel;
const controlActions = ca;
const trezorActions = trza;
const clientAction = cla;

let mockSignMessageAttempt;
let mockSignMessageAttemptTrezor;
let mockGetMessageVerificationServiceAttempt;
let mockVerifyMessageAttempt;

const testAddress = "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd";
const testSignature = "test-signature";
const testMessage = "secret message";
const testPassphrase = "testpassphrase";

beforeEach(() => {
  selectors.walletService = jest.fn(() => {
    return {};
  });

  controlActions.validateAddress = jest.fn(() => () => Promise.reject());
  mockSignMessageAttempt = controlActions.signMessageAttempt = jest.fn(
    () => () => {}
  );
  mockSignMessageAttemptTrezor = trezorActions.signMessageAttemptTrezor =
    jest.fn(() => () => {});
  mockGetMessageVerificationServiceAttempt =
    clientAction.getMessageVerificationServiceAttempt = jest.fn(() => () => {});
  mockVerifyMessageAttempt = controlActions.verifyMessageAttempt = jest.fn(
    () => () => {}
  );
});

const getCancelButton = () => screen.getByRole("button", { name: "Cancel" });
const getContinueButton = () =>
  screen.getByRole("button", { name: "Continue" });
const getValidateAddressInput = () =>
  screen.getByPlaceholderText("Enter an address to validate");
const getSignMessageAddressInput = () =>
  screen.getByPlaceholderText("Enter an address");
const getSignMessageMsgInput = () =>
  screen.getByPlaceholderText("Enter your message");
const getSignMessageSignatureInput = () =>
  screen.getByPlaceholderText("Enter your signature");
const getSignMessageButton = () =>
  screen.getByRole("button", { name: "Sign Message" });
const getPrivatePassphraseInput = () =>
  screen.getByLabelText("Private Passphrase");
const getVerifyMessageToggleBt = () => screen.getByText("Verify Message");
const getSignMessageToggleBt = () => screen.getByText("Sign Message");
const getVerifyMessageButton = () =>
  screen.getByRole("button", { name: "Verify Message" });

test("type invalid address to validate", async () => {
  const { user } = render(<PrivacyPage />);
  await user.click(screen.getByText("Security Center"));

  const validateAddressInput = getValidateAddressInput();
  await user.type(validateAddressInput, "random text");

  await waitFor(() => screen.getByText("Invalid address"));

  await user.clear(validateAddressInput);
  await waitFor(() =>
    expect(screen.queryByText("Invalid address")).not.toBeInTheDocument()
  );
});

test("type valid, not owned address to validate", async () => {
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 0,
        error: null,
        index: 0,
        isInternal: false,
        isMine: false,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);

  const validateAddressInput = getValidateAddressInput();

  await user.type(validateAddressInput, testAddress);
  await waitFor(() => screen.getByText("Address Valid, Not Owned"));
});

test("type valid, owned address to validate", async () => {
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 4,
        error: null,
        index: 57,
        isInternal: true,
        isMine: true,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);

  const validateAddressInput = getValidateAddressInput();

  await user.type(validateAddressInput, testAddress);
  await waitFor(() => screen.getByText("Owned address"));
  expect(
    screen.getByText(/Account Number/i).parentElement.textContent
  ).toMatchInlineSnapshot('"Account Number4Branch1Index57"');
});

test("test signing message", async () => {
  const testSignature = "test-signature";
  selectors.signMessageSignature = jest.fn(() => testSignature);
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 4,
        error: null,
        index: 57,
        isInternal: true,
        isMine: true,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);
  const signMessageButton = getSignMessageButton();
  expect(signMessageButton.disabled).toBe(true);

  await user.type(getSignMessageAddressInput(), testAddress);
  await user.type(getSignMessageMsgInput(), testMessage);

  await waitFor(() => expect(signMessageButton.disabled).toBe(false));

  await user.click(signMessageButton);

  // cancel first
  await user.click(getCancelButton());

  await user.click(signMessageButton);
  await user.type(getPrivatePassphraseInput(), testPassphrase);

  await user.click(getContinueButton());

  expect(mockSignMessageAttempt).toHaveBeenCalledWith(
    testAddress,
    testMessage,
    testPassphrase
  );

  expect(screen.getByText(testSignature)).toBeInTheDocument();
});

test("test signing message on a trezor-backed wallet", async () => {
  selectors.isTrezor = jest.fn(() => true);
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 4,
        error: null,
        index: 57,
        isInternal: true,
        isMine: true,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);
  const signMessageButton = getSignMessageButton();
  expect(signMessageButton.disabled).toBe(true);

  await user.type(getSignMessageAddressInput(), testAddress);
  await user.type(getSignMessageMsgInput(), testMessage);

  await waitFor(() => expect(signMessageButton.disabled).toBe(false));

  await user.click(signMessageButton);

  expect(mockSignMessageAttemptTrezor).toHaveBeenCalledWith(
    testAddress,
    testMessage
  );
});

test("test signing message using address not owning", async () => {
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 4,
        error: null,
        index: 57,
        isInternal: true,
        isMine: false,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);
  const signMessageButton = getSignMessageButton();
  expect(signMessageButton.disabled).toBe(true);

  await user.type(getSignMessageAddressInput(), testAddress);
  await user.type(getSignMessageMsgInput(), testMessage);

  await waitFor(() =>
    screen.getByText("Please enter a valid address owned by you")
  );
});

test("test verify message", async () => {
  selectors.verifyMessageSuccess = jest.fn(() => {
    return {
      valid: true
    };
  });
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 4,
        error: null,
        index: 57,
        isInternal: true,
        isMine: true,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);
  await user.click(getVerifyMessageToggleBt());
  const verifyMessageButton = getVerifyMessageButton();
  expect(verifyMessageButton.disabled).toBe(true);
  await waitFor(() =>
    expect(mockGetMessageVerificationServiceAttempt).toHaveBeenCalled()
  );

  await user.type(getSignMessageAddressInput(), testAddress);
  await user.type(getSignMessageSignatureInput(), testSignature);
  await user.type(getSignMessageMsgInput(), testMessage);
  await waitFor(() => expect(verifyMessageButton.disabled).toBe(false));

  await user.click(verifyMessageButton);
  expect(mockVerifyMessageAttempt).toHaveBeenCalledWith(
    testAddress,
    testMessage,
    testSignature
  );

  expect(screen.getByText("Valid Signature")).toBeInTheDocument();
});

test("test verify invalid message", async () => {
  selectors.verifyMessageSuccess = jest.fn(() => {
    return {
      valid: false
    };
  });
  controlActions.validateAddress = jest.fn(
    () => () =>
      Promise.resolve({
        accountNumber: 4,
        error: null,
        index: 57,
        isInternal: true,
        isMine: true,
        isScript: false,
        isValid: true,
        payToAddrScript: "",
        pkScriptAddrsList: [],
        pubKey: "",
        pubKeyAddr: "",
        scriptType: 0,
        sigsRequired: 0
      })
  );
  const { user } = render(<SecurityTab />);
  await user.click(getVerifyMessageToggleBt());
  const verifyMessageButton = getVerifyMessageButton();
  expect(verifyMessageButton.disabled).toBe(true);
  await waitFor(() =>
    expect(mockGetMessageVerificationServiceAttempt).toHaveBeenCalled()
  );

  await user.type(getSignMessageAddressInput(), testAddress);
  await user.type(getSignMessageSignatureInput(), testSignature);
  await user.type(getSignMessageMsgInput(), testMessage);
  await waitFor(() => expect(verifyMessageButton.disabled).toBe(false));

  await user.click(verifyMessageButton);
  expect(mockVerifyMessageAttempt).toHaveBeenCalledWith(
    testAddress,
    testMessage,
    testSignature
  );

  expect(screen.getByText("Invalid Signature")).toBeInTheDocument();

  // go back to Sign Message
  await user.click(getSignMessageToggleBt());
  expect(getSignMessageButton()).toBeInTheDocument();
});
