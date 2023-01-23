import PrivacyPage from "components/views/PrivacyPage";
import SecurityTab from "components/views/PrivacyPage/SecurityTab";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
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
  render(<PrivacyPage />);
  user.click(screen.getByText("Security Center"));

  const validateAddressInput = getValidateAddressInput();
  fireEvent.change(validateAddressInput, {
    target: { value: "random text" }
  });

  await waitFor(() => screen.getByText("Invalid address"));

  user.clear(validateAddressInput);
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
  render(<SecurityTab />);

  const validateAddressInput = getValidateAddressInput();

  fireEvent.change(validateAddressInput, {
    target: { value: "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd" }
  });
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
  render(<SecurityTab />);

  const validateAddressInput = getValidateAddressInput();

  fireEvent.change(validateAddressInput, {
    target: { value: "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd" }
  });
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
  render(<SecurityTab />);
  const testAddress = "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd";
  const testMessage = "secret message";
  const signMessageButton = getSignMessageButton();
  const testPassphrase = "testpassphrase";
  expect(signMessageButton.disabled).toBe(true);

  fireEvent.change(getSignMessageAddressInput(), {
    target: { value: testAddress }
  });
  fireEvent.change(getSignMessageMsgInput(), {
    target: { value: testMessage }
  });

  await waitFor(() => expect(signMessageButton.disabled).toBe(false));

  user.click(signMessageButton);

  // cancel first
  user.click(getCancelButton());

  user.click(signMessageButton);
  user.type(getPrivatePassphraseInput(), testPassphrase);

  user.click(getContinueButton());

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
  render(<SecurityTab />);
  const testAddress = "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd";
  const testMessage = "secret message";
  const signMessageButton = getSignMessageButton();
  expect(signMessageButton.disabled).toBe(true);

  fireEvent.change(getSignMessageAddressInput(), {
    target: { value: testAddress }
  });
  fireEvent.change(getSignMessageMsgInput(), {
    target: { value: testMessage }
  });

  await waitFor(() => expect(signMessageButton.disabled).toBe(false));

  user.click(signMessageButton);

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
  render(<SecurityTab />);
  const testAddress = "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd";
  const testMessage = "secret message";
  const signMessageButton = getSignMessageButton();
  expect(signMessageButton.disabled).toBe(true);

  fireEvent.change(getSignMessageAddressInput(), {
    target: { value: testAddress }
  });
  fireEvent.change(getSignMessageMsgInput(), {
    target: { value: testMessage }
  });

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
  render(<SecurityTab />);
  user.click(getVerifyMessageToggleBt());
  const testAddress = "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd";
  const testSignature = "test-signature";
  const testMessage = "secret message";
  const verifyMessageButton = getVerifyMessageButton();
  expect(verifyMessageButton.disabled).toBe(true);
  await waitFor(() =>
    expect(mockGetMessageVerificationServiceAttempt).toHaveBeenCalled()
  );

  fireEvent.change(getSignMessageAddressInput(), {
    target: { value: testAddress }
  });
  fireEvent.change(getSignMessageSignatureInput(), {
    target: { value: testSignature }
  });
  fireEvent.change(getSignMessageMsgInput(), {
    target: { value: testMessage }
  });
  await waitFor(() => expect(verifyMessageButton.disabled).toBe(false));

  user.click(verifyMessageButton);
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
  render(<SecurityTab />);
  user.click(getVerifyMessageToggleBt());
  const testAddress = "TsfDLrRkk9ciUuwfp2b8PawwnukYD7yAjGd";
  const testSignature = "test-signature";
  const testMessage = "secret message";
  const verifyMessageButton = getVerifyMessageButton();
  expect(verifyMessageButton.disabled).toBe(true);
  await waitFor(() =>
    expect(mockGetMessageVerificationServiceAttempt).toHaveBeenCalled()
  );

  fireEvent.change(getSignMessageAddressInput(), {
    target: { value: testAddress }
  });
  fireEvent.change(getSignMessageSignatureInput(), {
    target: { value: testSignature }
  });
  fireEvent.change(getSignMessageMsgInput(), {
    target: { value: testMessage }
  });
  await waitFor(() => expect(verifyMessageButton.disabled).toBe(false));

  user.click(verifyMessageButton);
  expect(mockVerifyMessageAttempt).toHaveBeenCalledWith(
    testAddress,
    testMessage,
    testSignature
  );

  expect(screen.getByText("Invalid Signature")).toBeInTheDocument();

  // go back to Sign Message
  user.click(getSignMessageToggleBt());
  expect(getSignMessageButton()).toBeInTheDocument();
});
