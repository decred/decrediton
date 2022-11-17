import { FormattedMessage as T, defineMessages } from "react-intl";
import { Tooltip } from "pi-ui";
import { ExternalLink } from "shared";
import { AboutModalButtonInvisible } from "buttons";
import styles from "./messages.module.css";

export const LogsLinkMsg = () => <T id="getStarted.btnLogs" m="Logs" />;
export const SettingsLinkMsg = () => (
  <T id="getStarted.btnSettings" m="Settings" />
);
export const HeaderTimeMsg = () => (
  <T
    id="getStarted.chainLoading.headerTime"
    m="Time from last fetched header: "
  />
);
export const BackBtnMsg = () => <T id="getStarted.backBtn" m="Cancel" />;
export const GoBackMsg = () => <T id="logs.goBack" m="Go back" />;
export const BackMsg = () => <T id="logs.back" m="Back" />;
export const ConfirmSeedMsg = () => (
  <T id="confirmSeed.label" m="Confirm Seed Key" />
);
export const DiscoverLabelMsg = () => (
  <T id="getStarted.discover.label" m="Scan for accounts" />
);
export const LoaderTitleMsg = () => (
  <T id="loader.title" m={"Welcome To Decrediton"} />
);
export const LoaderTitleMsgChooseTheWalletToAccess = () => (
  <T id="loader.title.chooseTheWallet" m={"Choose The Wallet To Access"} />
);
export const DiscoverAccountsInfoMsg = () => (
  <T
    id="getStarted.discoverAccountsInfo"
    m={`
  Enter the passphrase you just created to scan the blockchain for additional accounts you may have previously created with your wallet.

  Your account names aren't stored on the blockchain, so you will have to rename them after setting up Decrediton.
  `}
  />
);
export const ScanBtnMsg = () => (
  <T id="getStarted.discoverAddresses.scanBtn" m="Scan" />
);
export const LearnBasicsMsg = () => (
  <T id="getStarted.learnBasics" m="Learn the Basics" />
);
export const ReleaseInfoMsg = () => (
  <T id="getStarted.releaseInfo" m="Release Info" />
);
export const CreateWalletMsg = () => (
  <T id="createWallet.createWalletBtn" m="Create Wallet" />
);
export const CreateNewWalletTitle = () => (
  <T id="createWallet.title" m={"Create a new wallet"} />
);

export const messages = defineMessages({
  passphrasePlaceholder: {
    id: "getStarted.discoverAddresses.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  },
  confirmSeedWrongWordError: {
    id: "getStarted.confirmSeed.wrongWordError",
    defaultMessage:
      "Some words from the seed are incorrect. Please, choose the right ones to continue."
  },
  confirmSeedEnterAllWordsError: {
    id: "getStarted.confirmSeed.enterAllWords",
    defaultMessage: "*Please enter all words"
  },
  newSeedTabMsg: {
    id: "getStarted.newSeedTab",
    defaultMessage: "Create a New Wallet"
  },
  restoreTabMsg: {
    id: "getStarted.restore",
    defaultMessage: "Restore Existing Wallet"
  },
  trezorTabMsg: {
    id: "getStarted.trezor",
    defaultMessage: "Setup a Trezor Wallet"
  },
  closeEditWallets: {
    id: "getStarted.closeEditWallets",
    defaultMessage: "Close"
  },
  editWallets: {
    id: "getStarted.editWallets",
    defaultMessage: "Edit Wallets"
  },
  messageWalletNamePlaceholder: {
    id: "createwallet.walletname.placehlder",
    defaultMessage: "Choose a Name"
  },
  messageWalletNameTooltip: {
    id: "createwallet.walletname.tooltip",
    defaultMessage:
      "The name is used to identify your wallet. Restoring a wallet does not require the name to match the previous wallet name."
  },
  messageWalletWatchOnlyDescription: {
    id: "createwallet.watchonly.description",
    defaultMessage:
      "A watch-only wallet has limited functionality. It can only be used to view the balance and monitor transaction history. You won't be able to spend any DCR associated with this wallet."
  },
  messageWalletTrezorDescription: {
    id: "createwallet.trezor.description",
    defaultMessage:
      "Trezor is a hardware wallet. For more information, visit {link}"
  },
  messageWalletMasterPubKey: {
    id: "createwallet.walletpubkey.placeholder",
    defaultMessage: "Master Pub Key"
  },
  messageWalletMasterPubkeyError: {
    id: "createwallet.walletWatchOnly.error",
    defaultMessage: "Invalid Master Pubkey"
  },
  messageWalletDupeNameError: {
    id: "createwallet.dupeWalletName.error",
    defaultMessage: "Please choose an unused wallet name"
  },
  messageDisablecointypeupgrades: {
    id: "createwallet.disablecointypeupgrades.description",
    defaultMessage: "Never upgrade from legacy to SLIP0044 coin type keys"
  },
  messageGapLimit: {
    id: "createwallet.gaplimit.description",
    defaultMessage:
      "Allowed unused address gap between used addresses of accounts"
  }
});

export const UpdateAvailableLink = ({
  updateAvailable,
  className,
  tooltipClassName
}) => (
  <Tooltip
    contentClassName={tooltipClassName}
    content={
      <T
        id="getStarted.updateAvailableTooltip"
        m="New version {version} available"
        values={{ version: updateAvailable }}
      />
    }>
    <ExternalLink href="https://decred.org/downloads" className={className}>
      <T id="getStarted.updateAvailable" m="Update Available" />
    </ExternalLink>
  </Tooltip>
);

export const WhatsNewLink = ({ onShowReleaseNotes, appVersion }) => (
  <span onClick={onShowReleaseNotes} className={styles.whatsnew}>
    <T
      id="getStarted.whatsNew"
      m="What's New in v{version}"
      values={{ version: appVersion }}
    />
  </span>
);

export const AboutModalButton = ({ appVersion, updateAvailable }) => (
  <AboutModalButtonInvisible
    version={appVersion}
    updateAvailable={updateAvailable}
    className="about-modal-button"
    buttonLabel={<T id="help.about" m="About Decrediton" />}
  />
);
