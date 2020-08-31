import PrivacyPage from "components/views/GetStartedPage/PrivacyPage/PrivacyPage";
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

beforeEach(() => {
  mockSetupStandardPrivacy = da.setupStandardPrivacy = jest.fn(() => () => {});
  mockSetupDisabledPrivacy = da.setupDisabledPrivacy = jest.fn(() => () => {});
  mockUpdateStateSettingsChanged = sa.updateStateSettingsChanged = jest.fn(
    () => () => {}
  );
  mockTempSettings = sel.tempSettings = jest.fn(() => {
    return {
      allowedExternalRequests: []
    };
  });
  mockSaveSettings = sa.saveSettings = jest.fn(() => () => {});
  mockFinishPrivacy = da.finishPrivacy = jest.fn(() => () => {});
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
});
afterEach(() => {
  mockSetupStandardPrivacy.mockRestore();
  mockSetupDisabledPrivacy.mockRestore();
  mockUpdateStateSettingsChanged.mockRestore();
  mockTempSettings.mockRestore();
  mockSaveSettings.mockRestore();
  mockFinishPrivacy.mockRestore();
  mockIsTestNet.mockRestore();
});

test("render privacy page", () => {
  const { debug } = render(<PrivacyPage />);

  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );

  const privacyOptionsLabel = screen.getByText(/privacy options/i);
  expect(privacyOptionsLabel).toBeInTheDocument();
  expect(privacyOptionsLabel.nextSibling.textContent).toMatchInlineSnapshot(
    `"Select how Decrediton should connect to external services. You can change this in the application settings later."`
  );

  const standardLabel = screen.getByText(/standard/i);
  expect(standardLabel).toBeInTheDocument();
  expect(standardLabel.nextSibling.textContent).toMatchInlineSnapshot(
    `"Enables connections to most services for a better user experience and full access to features (such as version update, VSP listing, politeia, etc). Recommended for most users."`
  );
  user.click(standardLabel);
  expect(mockSetupStandardPrivacy).toHaveBeenCalledTimes(1);

  const noOutboundConnectionsLabel = screen.getByText(
    /no outbound connections/i
  );
  expect(noOutboundConnectionsLabel).toBeInTheDocument();
  expect(
    noOutboundConnectionsLabel.nextSibling.textContent
  ).toMatchInlineSnapshot(
    `"Disables all connections to third party (non-dcrd/non-dcrwallet) services. This may prevent you from using certain features of the app. Recommended for advanced users."`
  );
  user.click(noOutboundConnectionsLabel);
  expect(mockSetupDisabledPrivacy).toHaveBeenCalledTimes(1);

  const customizeAllowedConnectionsLabel = screen.getByText(
    /customize allowed connections/i
  );
  expect(customizeAllowedConnectionsLabel).toBeInTheDocument();
  expect(
    customizeAllowedConnectionsLabel.nextSibling.textContent
  ).toMatchInlineSnapshot(
    `"Allows you to choose exactly which third party services can be accessed by the app."`
  );
});

test("test custom privacy options", () => {
  render(<PrivacyPage />);

  const customizeAllowedConnectionsLabel = screen.getByText(
    /customize allowed connections/i
  );
  user.click(customizeAllowedConnectionsLabel);

  expect(screen.getByText(/update private passphrase/i)).toBeInTheDocument();

  const customPrivacyOptionsLabel = screen.getByText(/custom privacy options/i);
  expect(customPrivacyOptionsLabel).toBeInTheDocument();
  expect(
    customPrivacyOptionsLabel.nextSibling.textContent
  ).toMatchInlineSnapshot(
    `"Select which external requests Decrediton is allowed to make. You can change this later on the app settings page."`
  );

  const updateCheckLabel = screen.getByText(/update check/i);
  expect(updateCheckLabel.parentElement.textContent).toMatchInlineSnapshot(
    `"Update CheckGet latest released version from github.org"`
  );
  user.click(updateCheckLabel.parentElement.getElementsByTagName("input")[0]);

  const networkInformationLabel = screen.getByText("Network Information");
  expect(
    networkInformationLabel.parentElement.textContent
  ).toMatchInlineSnapshot(
    `"Network InformationGeneral network information (block height, etc) from decred.org"`
  );
  user.click(
    networkInformationLabel.parentElement.getElementsByTagName("input")[0]
  );

  const politeiaLabel = screen.getByText(/politeia/i);
  expect(politeiaLabel.parentElement.textContent).toMatchInlineSnapshot(
    `"PoliteiaList and vote on proposals on proposals.decred.org"`
  );
  user.click(politeiaLabel.parentElement.getElementsByTagName("input")[0]);

  const vspListingLabel = screen.getByText(/vsp listing/i);
  expect(vspListingLabel.parentElement.textContent).toMatchInlineSnapshot(
    `"VSP ListingList of currently available VSPs from decred.org"`
  );
  user.click(vspListingLabel.parentElement.getElementsByTagName("input")[0]);

  const decredBlockExplorerLabel = screen.getByText(/decred block explorer/i);
  expect(
    decredBlockExplorerLabel.parentElement.textContent
  ).toMatchInlineSnapshot(
    `"Decred Block ExplorerAccess chain information from dcrdata.decred.org"`
  );
  user.click(
    decredBlockExplorerLabel.parentElement.getElementsByTagName("input")[0]
  );

  expect(mockUpdateStateSettingsChanged).toHaveBeenCalledTimes(5);

  user.click(screen.getByText(/accept/i));
  expect(mockSaveSettings).toHaveBeenCalledTimes(1);
  expect(mockFinishPrivacy).toHaveBeenCalledTimes(1);

  user.click(screen.getByText(/cancel/i));
  expect(
    screen.getByText(/customize allowed connections/i)
  ).toBeInTheDocument();
});

test("render privacy page in testnet mode", () => {
 mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  render(<PrivacyPage />);
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
});
