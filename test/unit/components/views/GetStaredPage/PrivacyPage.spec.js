import { PrivacyPage } from "components/views/GetStartedPage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as da from "actions/DaemonActions";
import * as sa from "actions/SettingsActions";
import * as sel from "selectors";

let mockSetupStandardPrivacy;
let mockSetupDisabledPrivacy;
let mockUpdateStateSettingsChanged;
let mockTempSettings;
let mockSaveSettings;
let mockFinishPrivacy;
let mockIsTestNet;

const daemonActions = da;
const selectors = sel;
const settingsActions = sa;

beforeEach(() => {
  mockSetupStandardPrivacy = daemonActions.setupStandardPrivacy = jest.fn(
    () => () => {}
  );
  mockSetupDisabledPrivacy = daemonActions.setupDisabledPrivacy = jest.fn(
    () => () => {}
  );
  mockUpdateStateSettingsChanged = settingsActions.updateStateSettingsChanged =
    jest.fn(() => () => {});
  mockTempSettings = selectors.tempSettings = jest.fn(() => {
    return {
      allowedExternalRequests: []
    };
  });
  mockSaveSettings = settingsActions.saveSettings = jest.fn(() => () => {});
  mockFinishPrivacy = daemonActions.finishPrivacy = jest.fn(() => () => {});
  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  selectors.stakeTransactions = jest.fn(() => []);
});

test("render privacy page", async () => {
  render(<PrivacyPage />);

  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );

  const privacyOptionsLabel = screen.getByText(/privacy options/i);
  expect(privacyOptionsLabel).toBeInTheDocument();
  expect(privacyOptionsLabel.nextSibling.textContent).toMatchInlineSnapshot(
    '"Select how Decrediton should connect to external services. You can change this in the application settings later."'
  );

  const standardLabel = screen.getByText(/standard/i);
  expect(standardLabel).toBeInTheDocument();
  expect(standardLabel.nextSibling.textContent).toMatchInlineSnapshot(
    '"Enables connections to most services for a better user experience and full access to features (such as version update, VSP listing, Politeia, etc). Recommended for most users."'
  );
  await user.click(standardLabel);
  expect(mockSetupStandardPrivacy).toHaveBeenCalledTimes(1);

  const noOutboundConnectionsLabel = screen.getByText(
    /no outbound connections/i
  );
  expect(noOutboundConnectionsLabel).toBeInTheDocument();
  expect(
    noOutboundConnectionsLabel.nextSibling.textContent
  ).toMatchInlineSnapshot(
    '"Disables all connections to third party (non-dcrd/non-dcrwallet) services. This may prevent you from using certain features of the app. Recommended for advanced users."'
  );
  await user.click(noOutboundConnectionsLabel);
  expect(mockSetupDisabledPrivacy).toHaveBeenCalledTimes(1);

  const customizeAllowedConnectionsLabel = screen.getByText(
    /customize allowed connections/i
  );
  expect(customizeAllowedConnectionsLabel).toBeInTheDocument();
  expect(
    customizeAllowedConnectionsLabel.nextSibling.textContent
  ).toMatchInlineSnapshot(
    '"Allows you to choose exactly which third party services can be accessed by the app."'
  );

  expect(mockTempSettings).toHaveBeenCalled();
});

test("test custom privacy options", async () => {
  render(<PrivacyPage />);
  const customizeAllowedConnectionsLabel = screen.getByText(
    /customize allowed connections/i
  );
  await user.click(customizeAllowedConnectionsLabel);

  const customPrivacyOptionsLabel = screen.getByText(/custom privacy options/i);
  expect(customPrivacyOptionsLabel).toBeInTheDocument();
  expect(
    customPrivacyOptionsLabel.nextSibling.textContent
  ).toMatchInlineSnapshot(
    '"Select which external requests Decrediton is allowed to make. You can change this later on the app settings page."'
  );

  const updateCheckLabel = screen.getByText(/update check/i);
  expect(
    updateCheckLabel.parentElement.nextSibling.textContent
  ).toMatchInlineSnapshot('"Get latest released version from github.org"');
  await user.click(
    updateCheckLabel.parentElement.getElementsByTagName("input")[0]
  );

  const networkInformationLabel = screen.getByText("Network Information");
  expect(
    networkInformationLabel.parentElement.nextSibling.textContent
  ).toMatchInlineSnapshot(
    '"General network information (block height, etc) from decred.org"'
  );
  await user.click(
    networkInformationLabel.parentElement.getElementsByTagName("input")[0]
  );

  const politeiaLabel = screen.getByText(/politeia/i);
  expect(
    politeiaLabel.parentElement.nextSibling.textContent
  ).toMatchInlineSnapshot(
    '"List and vote on proposals on proposals.decred.org"'
  );
  await user.click(
    politeiaLabel.parentElement.getElementsByTagName("input")[0]
  );

  const vspListingLabel = screen.getByText(/vsp listing/i);
  expect(
    vspListingLabel.parentElement.nextSibling.textContent
  ).toMatchInlineSnapshot('"List of currently available VSPs from decred.org"');
  await user.click(
    vspListingLabel.parentElement.getElementsByTagName("input")[0]
  );

  const decredBlockExplorerLabel = screen.getByText(/decred block explorer/i);
  expect(
    decredBlockExplorerLabel.parentElement.nextSibling.textContent
  ).toMatchInlineSnapshot('"Access chain information from dcrdata.decred.org"');
  await user.click(
    decredBlockExplorerLabel.parentElement.getElementsByTagName("input")[0]
  );

  expect(mockUpdateStateSettingsChanged).toHaveBeenCalledTimes(5);

  await user.click(screen.getByText(/accept/i));
  expect(mockSaveSettings).toHaveBeenCalledTimes(1);
  expect(mockFinishPrivacy).toHaveBeenCalledTimes(1);

  await user.click(screen.getByText(/cancel/i));
  expect(
    screen.getByText(/customize allowed connections/i)
  ).toBeInTheDocument();
});

test("render privacy page in testnet mode", () => {
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);
  render(<PrivacyPage />);
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
  expect(mockIsTestNet).toHaveBeenCalled();
});
