import { FormattedMessage as T, defineMessages } from "react-intl";
import { ExternalLink, Tooltip } from "shared";
import { AboutModalButtonInvisible } from "buttons";

export const LogsLinkMsg = () => <T id="getStarted.btnLogs" m="Logs" />;
export const SettingsLinkMsg = () => <T id="getStarted.btnSettings" m="Settings" />;
export const HeaderTimeMsg = () => <T id="getStarted.chainLoading.headerTime" m="Time from last fetched header:"/>;
export const BackBtnMsg = () => <T id="getStarted.backBtn" m="Cancel" />;
export const GoBackMsg = () => <T id="logs.goBack" m="Go back" />;
export const CreateWalletTitleMsg = () => <T id="createWallet.title" m={"Create a new wallet"}/>;
export const ConfirmSeedMsg = () => <T id="confirmSeed.label" m="Confirm Seed" />;
export const DiscoverLabelMsg = () => <T id="getStarted.discover.label" m="Scan for accounts" />;
export const LoaderTitleMsg = () => <T id="loader.title" m={"Welcome to Decrediton Wallet"}/>;
export const DiscoverAccountsInfoMsg = () =>
  <T id="getStarted.discoverAccountsInfo" m={`
  Enter the passphrase you just created to scan the blockchain for additional accounts you may have previously created with your wallet.

  Your account names aren't stored on the blockchain, so you will have to rename them after setting up Decrediton.
  `}/>;
export const ScanBtnMsg = () => <T id="getStarted.discoverAddresses.scanBtn" m="Scan" />;
export const LearnBasicsMsg = () => <T id="getStarted.learnBasics" m="Learn the Basics" />;
export const NewSeedTabMsg = () => <T id="getStarted.newSeedTab" m="Create a New Wallet"/>;
export const RestoreTabMsg = () => <T id="getStarted.restore" m="Restore Existing Wallet"/>;

export const messages = defineMessages({
  passphrasePlaceholder: {
    id: "getStarted.discoverAddresses.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

export const UpdateAvailableLink = ({ updateAvailable }) => (
  <Tooltip text={<T id="getStarted.updateAvailableTooltip" m="New version {version} available" values={{ version: (updateAvailable) }}/>}>
    <ExternalLink className="update-available-button" href="https://decred.org/downloads">
      <T id="getStarted.updateAvailable" m="Update Available" />
    </ExternalLink>
  </Tooltip>
);

export const WhatsNewLink = ({ onShowReleaseNotes, appVersion }) => (
  <span onClick={onShowReleaseNotes} className="whatsnew">
    <T id="getStarted.whatsNew" m="What's New in v{version}"
      values={{ version: (appVersion) }}/>
  </span>
);

export const AboutModalButton = ({ appVersion, updateAvailable }) => (
  <AboutModalButtonInvisible
    version={appVersion}
    updateAvailable={updateAvailable}
    buttonLabel={<T id="help.about" m="About Decrediton" />}
  />
);
