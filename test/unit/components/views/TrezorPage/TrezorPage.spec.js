import TrezorPageContent from "views/TrezorPage/TrezorPageContent";
import TrezorPageSection from "views/TrezorPage/TrezorPageSection";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import * as sel from "selectors";
import * as trza from "actions/TrezorActions";

const selectors = sel;
const trezorActions = trza;

let mockTrezorConnect,
  mockTogglePinProtection,
  mockTogglePassphraseProtection,
  mockTogglePassphraseOnDeviceProtection,
  mockChangeToDecredHomeScreen,
  mockChangeLabel,
  mockWipeDevice,
  mockRecoverDevice,
  mockInitDevice,
  mockBackupDevice,
  mockUpdateFirmware;

beforeEach(() => {
  selectors.trezorDevice = jest.fn(() => "trezorDeviceId");
  mockTogglePinProtection = trezorActions.togglePinProtection = jest.fn(
    () => () => {}
  );
  mockTogglePassphraseProtection = trezorActions.togglePassPhraseProtection =
    jest.fn(() => () => {});
  mockTogglePassphraseOnDeviceProtection =
    trezorActions.togglePassphraseOnDevice = jest.fn(() => () => {});
  mockChangeToDecredHomeScreen = trezorActions.changeToDecredHomeScreen =
    jest.fn(() => () => {});

  mockWipeDevice = trezorActions.wipeDevice = jest.fn(() => () => {});
  mockRecoverDevice = trezorActions.recoverDevice = jest.fn(() => () => {});
  mockInitDevice = trezorActions.initDevice = jest.fn(() => () => {});
  mockBackupDevice = trezorActions.backupDevice = jest.fn(() => () => {});
  mockUpdateFirmware = trezorActions.updateFirmware = jest.fn(() => () => {});

  mockChangeLabel = trezorActions.changeLabel = jest.fn(() => () => {});

  mockTrezorConnect = trezorActions.connect = jest.fn(() => () => {});

  selectors.trezorDevice = jest.fn(() => "trezorDeviceId");
});

const getPinProtectionToggleLabel = () =>
  screen.getByText(/toggle pin protection \((\w+\))/i);
const getDisablePinProtectionToggleTooltip = () =>
  screen.getByText("Disable PIN Protection");
const getEnablePinProtectionToggleTooltip = () =>
  screen.getByText("Enable PIN Protection");
const getPassphraseProtectionToggleLabel = () =>
  screen.getByText(/toggle passphrase protection \((\w+\))/i);
const getDisablePassphraseProtectionToggleTooltip = () =>
  screen.getByText("Disable Passphrase Protection");
const getEnablePassphraseProtectionToggleTooltip = () =>
  screen.getByText("Enable Passphrase Protection");
const getPassphraseOnDeviceProtectionToggleLabel = () =>
  screen.getByText(/toggle passphrase protection on Device \((\w+\))/i);
const getDisablePassphraseOnDeviceProtectionToggleTooltip = () =>
  screen.getByText("Disable Passphrase On Device Protection");
const getEnablePassphraseOnDeviceProtectionToggleTooltip = () =>
  screen.getByText("Enable Passphrase On Device Protection");

test("no trezor is detected", () => {
  selectors.trezorDevice = jest.fn(() => null);
  render(<TrezorPageContent ContainerComponent={TrezorPageSection} />);
  expect(
    screen.getByText(/no trezor is detected/i).textContent
  ).toMatchInlineSnapshot(
    '"No Trezor is detected. Connect the Device and check if Trezor bridge is installed and running on latest firmware."'
  );

  user.click(screen.getByText(/connect to trezor/i));
  expect(mockTrezorConnect).toHaveBeenCalled();
});

test("test pin protection switch", async () => {
  const { store } = render(
    <TrezorPageContent ContainerComponent={TrezorPageSection} />
  );
  const features = {
    pin_protection: true
  };
  const pinProtectionLabel = getPinProtectionToggleLabel();

  // the control is in loading state
  expect(pinProtectionLabel.previousElementSibling.className).toBe("spinner");
  expect(pinProtectionLabel.textContent).toMatchInlineSnapshot(
    '"Toggle PIN Protection (loading)"'
  );

  // features has been fetched
  store.dispatch({ type: trza.TRZ_GETFEATURES_SUCCESS, features });

  await waitFor(() => {
    expect(pinProtectionLabel.previousElementSibling.className).not.toBe(
      "spinner"
    );
    expect(getDisablePinProtectionToggleTooltip()).toBeInTheDocument();
    expect(pinProtectionLabel.textContent).toMatchInlineSnapshot(
      '"Toggle PIN Protection (on)"'
    );
  });

  // click on switch
  user.click(
    getDisablePinProtectionToggleTooltip().nextElementSibling.firstElementChild
  );
  expect(mockTogglePinProtection).toHaveBeenCalled();

  // features has been fetched again
  features.pin_protection = false;
  store.dispatch({ type: trza.TRZ_GETFEATURES_SUCCESS, features });

  await waitFor(() => {
    expect(getEnablePinProtectionToggleTooltip()).toBeInTheDocument();
    expect(pinProtectionLabel.textContent).toMatchInlineSnapshot(
      '"Toggle PIN Protection (off)"'
    );
  });
});

test("test passphrase protection switch", async () => {
  const { store } = render(
    <TrezorPageContent ContainerComponent={TrezorPageSection} />
  );
  const features = {
    passphrase_protection: true
  };
  const passphraseProtectionLabel = getPassphraseProtectionToggleLabel();

  // the control is in loading state
  expect(passphraseProtectionLabel.previousElementSibling.className).toBe(
    "spinner"
  );
  expect(passphraseProtectionLabel.textContent).toMatchInlineSnapshot(
    '"Toggle Passphrase Protection (loading)"'
  );

  // features has been fetched
  store.dispatch({ type: trza.TRZ_GETFEATURES_SUCCESS, features });
  await waitFor(() => {
    expect(passphraseProtectionLabel.previousElementSibling.className).not.toBe(
      "spinner"
    );
    expect(getDisablePassphraseProtectionToggleTooltip()).toBeInTheDocument();
    expect(passphraseProtectionLabel.textContent).toMatchInlineSnapshot(
      '"Toggle Passphrase Protection (on)"'
    );
  });

  // click on switch
  user.click(
    getDisablePassphraseProtectionToggleTooltip().nextElementSibling
      .firstElementChild
  );
  expect(mockTogglePassphraseProtection).toHaveBeenCalled();

  // features has been fetched again
  features.passphrase_protection = false;
  store.dispatch({ type: trza.TRZ_GETFEATURES_SUCCESS, features });

  await waitFor(() => {
    expect(getEnablePassphraseProtectionToggleTooltip()).toBeInTheDocument();
    expect(passphraseProtectionLabel.textContent).toMatchInlineSnapshot(
      '"Toggle Passphrase Protection (off)"'
    );
  });
});

test("test passphrase on device protection switch", async () => {
  const { store } = render(
    <TrezorPageContent ContainerComponent={TrezorPageSection} />
  );
  const features = {
    passphrase_always_on_device: true
  };
  const passphraseOnDeviceProtectionLabel =
    getPassphraseOnDeviceProtectionToggleLabel();

  // the control is in loading state
  expect(
    passphraseOnDeviceProtectionLabel.previousElementSibling.className
  ).toBe("spinner");
  expect(passphraseOnDeviceProtectionLabel.textContent).toMatchInlineSnapshot(
    '"Toggle Passphrase Protection On Device (loading)"'
  );

  // features has been fetched
  store.dispatch({ type: trza.TRZ_GETFEATURES_SUCCESS, features });
  await waitFor(() => {
    expect(
      passphraseOnDeviceProtectionLabel.previousElementSibling.className
    ).not.toBe("spinner");
    expect(
      getDisablePassphraseOnDeviceProtectionToggleTooltip()
    ).toBeInTheDocument();
    expect(passphraseOnDeviceProtectionLabel.textContent).toMatchInlineSnapshot(
      '"Toggle Passphrase Protection On Device (on)"'
    );
  });

  // click on switch
  user.click(
    getDisablePassphraseOnDeviceProtectionToggleTooltip().nextElementSibling
      .firstElementChild
  );
  expect(mockTogglePassphraseOnDeviceProtection).toHaveBeenCalled();

  // features has been fetched again
  features.passphrase_always_on_device = false;
  store.dispatch({ type: trza.TRZ_GETFEATURES_SUCCESS, features });
  await waitFor(() => {
    expect(
      getEnablePassphraseOnDeviceProtectionToggleTooltip()
    ).toBeInTheDocument();
    expect(passphraseOnDeviceProtectionLabel.textContent).toMatchInlineSnapshot(
      '"Toggle Passphrase Protection On Device (off)"'
    );
  });
});

test("test `Label and Homescreen` section", () => {
  render(<TrezorPageContent ContainerComponent={TrezorPageSection} />);
  user.click(screen.getByLabelText("Use Decred Symbol on homescreen"));
  expect(mockChangeToDecredHomeScreen).toHaveBeenCalled();

  // change device label
  const testDeviceLabel = "test-device-label";
  user.type(screen.getByLabelText("Trezor Device Label"), testDeviceLabel);
  user.click(screen.getByText("Change Label"));
  expect(mockChangeLabel).toHaveBeenCalledWith(testDeviceLabel);
});

test("test `Device Setup and Recovery` and `Firmware Update` section", () => {
  render(<TrezorPageContent ContainerComponent={TrezorPageSection} />);
  user.click(screen.getByRole("button", { name: "Wipe Device" }));
  expect(mockWipeDevice).toHaveBeenCalled();

  user.click(screen.getByRole("button", { name: "Recover Device" }));
  expect(mockRecoverDevice).toHaveBeenCalled();

  user.click(screen.getByRole("button", { name: "Initialize Device" }));
  expect(mockInitDevice).toHaveBeenCalled();

  user.click(screen.getByRole("button", { name: "Backup Device" }));
  expect(mockBackupDevice).toHaveBeenCalled();

  const testPath = "test-path";
  user.type(screen.getByLabelText("Path to firmware file"), testPath);
  user.click(screen.getByRole("button", { name: "Update Firmware" }));
  expect(mockUpdateFirmware).toHaveBeenCalledWith(testPath);
});
