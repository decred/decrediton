// url converts from the the webpack-genetered asset url into a css url directive.
const url = (s) => `url('${s}')`;

const darkTheme = {
  "background-back-color": "#223767",
  "background-container": "#1B2B54",
  "background-container-opaque": "rgba(54, 87, 158, 0.895)",
  "background-container-hover": "#1B2B54",
  "background-hovered": "#29417A",
  "input-color-default": "#E9F8FE",
  "input-color-hovered": "#E9F8FE",
  "input-color-focused": "#E9F8FE",
  "input-color-disabled": "#dadfe2",
  "input-color-shadow": "rgba(9, 20, 64, 0.21)",
  "button-text": "#2F4D8C",
  "white-button-text": "#E9F8FE",
  "title-text-and-button-background": "#B7DEEE",
  "title-text-and-button-background-hovered": "#608ACE",
  "title-text-and-button-background-drop-shadow": "rgba(181, 187, 197, 0.34)",
  "stroke-color-default": "#769ECF",
  "stroke-color-hovered": "#B7DEEE",
  "stroke-color-focused": "#a9c5ff",
  "input-color": "#2970ff",
  "input-color-blue-shadow": "rgba(41, 112, 255, 0.21)",
  "input-color-hover": "#7ea9ff",
  "account-button-hover": "#4a92ff",
  "link-color": "#2970FF",
  "link-hover-color": "#6397ff",
  "accent-color": "#2ed8a3",
  "blue-highlight-background": "#2F4D8C",
  "tab-text": "#608ACE",
  "tab-text-active-hover": "#E9F8FE",
  "cyan-bold": "#69d5f7",
  "disabled-color": "#3C62B0",
  "disabled-background-color": "#1F325F",
  "disabled-background-color-lighter": "#2F4D8C",
  "success-text-color": "#41be53",
  "error-text-color": "#fd714b",
  "error-red": "#ED6D47",
  "error-red-hover": "red",
  "vote-yes-color": "#2ed8a3",
  "vote-no-color": "#f2734f",
  "vote-abstain-color": "#596d81",
  "white-border": "#1B2B54",
  "display-wallet-gradient-right": "#a9a9aa",
  "display-wallet-gradient-selected-right": "#6ed3f3",
  "tx-history-background-hover": "#29417A",
  "sidebar-color": "#152042",
  "short-separator-border": "#36579E",
  "sidebar-bottom-light-text-color": "#7DA7D9",
  "header-desc-color": "#769ECF",
  "sidebar-menu-link": "#6F98D3",
  "linear-progress-text": "#1B2B54",
  "wallet-label": "#3C62B0",
  "new-wallet-label": "#769ECF",
  "selected_wallet-label": "#091440",
  "wallet-desc": "#25549F",
  "getstarted-menu-color": "#B7DEEE",
  "tutorial-header": "#B7DEEE",
  "step-indicator": "#3C62B0",
  "combobox-outer-bottom-border": "#223767",
  "combobox-restore-border": "#769ECF",
  "text-toggle-button-active-bg": "#29417A",
  "text-toggle-button-active-text": "#E9F8FE",
  "text-toggle-button-border": "#1B2B54",
  "text-toggle-button-bg": "#1F325F",
  "text-toggle-button-inactive-text": "#2F4D8C",
  "header-desc-lighter-color": "#99C1E3",
  "info-modal-button-bg": "#7DA7D9",
  "info-modal-button-text": "#0E152F",
  "agenda-card-bottom-cfg": "#99C1E3",
  "tabbed-page-header-bg": "#223767",
  "tabbed-page-header-active-bg": "#2F4D8C",
  "tabbed-page-header-text": "#E9F8FE",
  "overview-balance-label": "#769ECF",
  "chart-axis-stroke": "#1B2B54",
  "chart-axis-text": "#769ECF",
  "disabled-background-color-dark": "#152042",
  "wallet-tutorial-text": "#E9F8FE",
  "wallet-tutorial-link": "#608ACE",
  "wallet-tutorial-step-indicator": "#99C1E3",
  "modal-text": "#99C1E3",
  "modal-bottom": "#E9F8FE",
  "modal-stroke-color": "#1B2B54",
  "settings-desc": "#769ECF",
  "wallet-close-button-bg": "#1B2B54",
  "wallet-close-button-text": "#E9F8FE",
  "select-stroke-color": "#608ACE",
  "account-text": "#3C62B0",
  "account-pubkey-text": "#2970FF",
  "back-button-bg": "#1B2B54",
  "back-button-text": "#E9F8FE",
  "back-button-dark-text": "#0E152F",
  "tx-detail-text": "#E9F8FE",
  "tx-detail-raw-shadow":
    "linear-gradient(to top, rgb(243, 246, 246, 0.25) 10%, rgb(243, 246, 246, 0.20) 20%, rgb(243, 246, 246, 0) 70%)",
  "home-content-link": "#99C1E3",
  "transfer-details-bg": "#152042",
  "filter-menu-arrow": "#99C1E3",
  "filter-menu-bg-hover": "#3C62B0",
  "menutab-hover": "#7DA7D9",
  "tooltip-container": "#1F325F",
  "loader-bg": "#223767",
  "display-wallet-bg": "#152042",
  "select-border": "#608ACE",
  "toggle-switch-bg": "#7DA7D9",
  "toggle-switch-knob-bg": "#E9F8FE",
  "transaction-account-name-bg": "#2F4D8C",
  "account-row-hover": "#1F325F",
  "chart-cursor-color": "#36579E",
  "linear-progress-text-default": "#fff",
  "linear-progress-text-initial": "#7DA7D9",
  "onboard-toolbar-shadow": "rgba(9,20,64,0.13)",
  "onboard-toolbar-background": "#152042",
  "background-copy-color": "#e9f8ff",
  "input-placeholder-color": "#608ACE",
  "seedword-number-color": "#223767",
  "seedword-select-border-default-text-color": "#7DA7D9",
  "seedword-select-border-default-border-color": "#2F4D8C",
  "seedword-select-border-default-hover-border-color": "#608ACE",
  "seedword-select-border-default-hover-text-color": "#7DA7D9",
  "txdetails-top-bg": "#1F325F",
  "trezor-line-color": "#608ACE",
  "proposal-text-markdown": "#f6f8fa",
  "background-address-copy-color": "#2F4D8C",
  "icons-shadow": "#09144036",
  "no-more-tickets-indicator-bg": "#2F4D8C",
  "input-copy-hover-color": "#78d9f8",
  "coinjoin-sum-color": "#7DA7D9",
  "coinjoin-sum-text-color": "#fff",
  "privacy-balance-color": "#b7deee",
  "privacy-balance-label-color": "#b7deee",
  "privacy-balance-mixed-label-color": "#b7deee",
  "privacy-mixer-status-color": "#b7deee",
  "mixer-settings-label": "#e9f8fe",
  "mixer-settings-disabled": "#3c62b0",
  "accent-blue": "#2970FF",
  "grey-2": "#1f325f",
  "grey-3": "#E6EAED",
  "grey-5": "#3c62b0",
  "grey-7": "#608ace",
  orange: "#ED6D47",
  "main-dark-blue": "#e9f8fe0",
  "light-blue": "#D4F0FD",
  "small-button-shadow": "rgba(0, 0, 0, 0.12)",
  "small-button-bg": "#2f4d8c",
  "small-button-disabled-bg": "#1f325f",
  "send-transaction-border": "#608ace",
  "secondary-piui-button-bg": "#fff",
  "purchase-ticket-border": "#608ace",
  "stakeinfo-value": "#e9f8fe",
  "stakeinfo-border": "#608ace",
  "purchase-label": "#b7deee",
  "governance-tab-bg": "#1F325F",
  "governance-header-balance-bg": "var(--blue-highlight-background)",
  "politeia-button-bg": "#7DA7D9",
  "governance-nav-button-bg": "#283f77",
  "refresh-proposals": "var(--politeia-button-bg)",
  "agenda-preference": "var(--grey-2)",
  "text-toggle-bg": "#1B2B54",
  "ln-autopilot-switch-desc": "#3C62B0",
  "ln-close-channel-button-bg": "#7DA7D9",
  "ln-close-channel-button-text": "#0E152F",

  // override pi-ui's toggle default dark background
  "toggle-bar-color": "var(--background-copy-color)",

  // override pi-ui's tab colors
  "tab-default-color": "transparent", // default border
  "tab-active-background": "var(--background-back-color)",
  "tab-text-active-color": "var(--input-color-default)",
  "tab-text-color": "var(--sidebar-menu-link)",

  /* icons */
  "menu-settings": url(require("style/icons/menuSettingsDark.svg")),
  "menu-accounts": url(require("style/icons/accountsActiveDark.svg")),
  "menu-governance": url(require("style/icons/governanceActiveDark.svg")),
  "menu-transactions": url(require("style/icons/transactionsActiveDark.svg")),
  "menu-overview": url(require("style/icons/overviewActiveDark.svg")),
  "menu-privacy": url(require("style/icons/privacyDark.svg")),
  "menu-tickets": url(require("style/icons/ticketsActiveDark.svg")),
  "menu-ln": url(require("style/icons/lightningDark.svg")),
  "menu-trezor": url(require("style/icons/trezorActiveDark.svg")),
  "menu-hamburger": url(require("style/icons/hamburgerDark.svg")),
  "menu-arrow": url(require("style/icons/arrowDark.svg")),
  "menu-mixer-icon": url(require("style/icons/menuMixerDark.svg")),
  "menu-spvon-icon": url(require("style/icons/menuSpvOnDark.svg")),
  "menu-spvoff-icon": url(require("style/icons/menuSpvOffDark.svg")),
  "menu-block-synced-icon": url(require("style/icons/blockSyncedDark.svg")),
  "menu-dex": url(require("style/icons/dexDark.svg")),
  "tab-icon-balance": url(require("style/icons/sidebarBalanceDark.svg")),
  "tab-icon-transactions": url(
    require("style/icons/transactionsDefaultDark.svg")
  ),
  "tab-icon-tickets": url(require("style/icons/ticketsDefaultDark.svg")),
  "sidebar-balance-icon": url(require("style/icons/sidebarBalanceDark.svg")),
  "testnet-logo": url(require("style/icons/testnetLogoDark.svg")),
  "mainnet-logo": url(require("style/icons/decredLogoDark.svg")),
  "create-wallet-icon": url(require("style/icons/createnewwalletDark.svg")),
  "wallet-blue-icon": url(require("style/icons/walletBlueDark.svg")),
  "wallet-gray-icon": url(require("style/icons/walletGrayDark.svg")),
  blockchain: url(require("style/icons/blockchainDark.svg")),
  "blockchain-default": url(require("style/icons/blockchainDefaultDark.svg")),
  "blockchain-initial": url(require("style/icons/blockchainInitialDark.svg")),
  "launcher-edit-wallets": url(require("style/icons/editDefaultDark.svg")),
  "launcher-edit-wallets-hover": url(require("style/icons/editHoverDark.svg")),
  "onboarding-checkcircle": url(
    require("style/icons/onboardingCheckcircleDark.svg")
  ),
  "x-grey": url(require("style/icons/xGreyDark.svg")),
  "copy-to-clipboard-icon": url(
    require("style/icons/copyToClipboardBlueDark.svg")
  ),
  "stakey-privacy-standard": url(
    require("style/icons/privacyStandardDark.svg")
  ),
  "stakey-privacy-disabled": url(
    require("style/icons/privacyDisabledDark.svg")
  ),
  "stakey-privacy-custom": url(require("style/icons/privacyCustomDark.svg")),
  "header-transactions": url(require("style/icons/transactionsHeaderDark.svg")),
  "header-governance": url(require("style/icons/governanceHeaderDark.svg")),
  "header-tickets": url(require("style/icons/ticketsHeaderDark.svg")),
  "header-accounts": url(require("style/icons/accountsHeaderDark.svg")),
  "header-lightning": url(require("style/icons/lightningHeaderDark.svg")),
  "header-security": url(require("style/icons/privacyHeaderDark.svg")),
  "header-trezor": url(require("style/icons/trezorHeaderDark.svg")),
  "header-dex": url(require("style/icons/dexDark.svg")),
  "help-docs": url(require("style/icons/docsGreyDark.svg")),
  "help-github": url(require("style/icons/githubGreyDark.svg")),
  "help-forum": url(require("style/icons/forumGreyDark.svg")),
  "help-stakepools": url(require("style/icons/stakepoolsGreyDark.svg")),
  "help-matrix": url(require("style/icons/matrixGreyDark.svg")),
  "help-blockchain-explorer": url(
    require("style/icons/blockchainExplorerGreyDark.svg")
  ),
  "help-constitution": url(require("style/icons/constitutionGreyDark.svg")),
  "help-star": url(require("style/icons/starGreyDark.svg")),
  "help-external-default": url(require("style/icons/externalDefaultDark.svg")),
  "help-external-hover": url(require("style/icons/externalHoverDark.svg")),
  "help-expand-default": url(require("style/icons/expandDefaultDark.svg")),
  "help-expand-hover": url(require("style/icons/expandHoverDark.svg")),
  "menu-arrow-up": url(require("style/icons/menuArrowUpDark.svg")),
  "agenda-close-icon": url(require("style/icons/ticketsAgendaCloseDark.svg")),
  "tickets-info-icon": url(require("style/icons/ticketsInfoDark.svg")),
  "agenda-card-kebab": url(
    require("style/icons/ticketsAgendaCardKebabDark.svg")
  ),
  "arrow-right-gray-icon": url(require("style/icons/arrowRightGrayDark.svg")),
  "send-self-default": url(require("style/icons/sendSelfDefaultDark.svg")),
  "send-all-default": url(require("style/icons/sendMaxDefaultDark.svg")),
  "search-icon": url(require("style/icons/searchDark.svg")),
  "wallet-tutorial-check-circle": url(
    require("style/icons/walletTutorialCheckcircleDark.svg")
  ),
  "importscript-icon": url(require("style/icons/importScriptDark.svg")),
  "stakepool-stats-active-icon": url(
    require("style/icons/stakepoolsActiveDark.svg")
  ),
  "accounts-default": url(require("style/icons/accountDefaultDark.svg")),
  "accounts-imported": url(require("style/icons/accountImportedDark.svg")),
  password: url(require("style/icons/passwordDark.svg")),
  "tx-details-arrow-left": url(
    require("style/icons/txDetailsArrowLeftDark.svg")
  ),
  "stake-pool-icon": url(require("style/icons/stakepoolDark.svg")),
  "expiry-icon": url(require("style/icons/expiryDark.svg")),
  "split-fee-icon": url(require("style/icons/splitFeeDark.svg")),
  "pool-fee-icon": url(require("style/icons/poolFeesDark.svg")),
  "tickets-cogs-opened-icon": url(
    require("style/icons/ticketsCogsOpenedDark.svg")
  ),
  "ticket-address-icon": url(require("style/icons/votingAddressDark.svg")),
  "fee-address-icon": url(require("style/icons/poolFeeAddressDark.svg")),
  "sort-by-icon": url(require("style/icons/sortbyDark.svg")),
  "contextbutton-eye-default-icon": url(
    require("style/icons/contextbuttonEyeDefaultDark.svg")
  ),
  qrcode: url(require("style/icons/decred-qrcode.png")),
  "launcher-logo": url(require("style/icons/launcherLogoDark.svg")),
  "help-getstared": url(require("style/icons/helpGetstaredDark.svg")),
  "no-tx-icon": url(require("style/icons/noTxDark.svg")),
  "ticket-reward-icon": url(require("style/icons/blockRewardDark.svg")),
  "time-lock-icon": url(require("style/icons/timeLockDark.svg")),
  "small-logo": url(require("style/icons/logoDark.svg")),
  "stakepool-stats-icon": url(require("style/icons/stakepoolsDefaultDark.svg")),
  "vote-time-stats-icon": url(require("style/icons/voteTimeDefaultDark.svg")),
  "vote-time-stats-active-icon": url(
    require("style/icons/voteTimeActiveDark.svg")
  ),
  "stakerewards-stats-icon": url(
    require("style/icons/stakeRewardsDefaultDark.svg")
  ),
  "stakerewards-stats-active-icon": url(
    require("style/icons/stakeRewardsActiveDark.svg")
  ),
  "send-self-hover": url(require("style/icons/sendSelfHoverDark.svg")),
  "send-all-hover": url(require("style/icons/sendMaxHoverDark.svg")),
  "select-arrow-up": url(require("style/icons/selectArrowUpDark.svg")),
  "info-icon": url(require("style/icons/informationDark.svg")),
  "menu-cancel-rescan-icon": url(
    require("style/icons/menuCancelRescanDark.svg")
  ),
  "politeia-loading-animation": url(
    require("style/animations/politeiaLoadingDark.gif")
  ),
  "backup-icon": url(require("style/icons/harddriveDark.svg")),
  "loader-animation-daemon-waiting-initial": url(
    require("style/icons/daemonWaitingLoaderInitialDark.gif")
  ),
  "mixed-account-icon": url(require("style/icons/mixedAccountDark.svg")),
  "unmixed-account-icon": url(require("style/icons/unmixedAccountDark.svg")),
  "privacy-running-arrows": url(require("style/icons/mixerArrowsDark.gif")),
  "decentralized-loop-still": url(
    require("style/icons/decentralizedLoopStillDark.svg")
  ),
  "decentralized-loop-animation": url(
    require("style/icons/decentralizedLoopAnimationDark.gif")
  ),
  "self-transaction-icon": url(require("style/icons/sentToSelfTxDark.svg")),
  "proposals-refresh-icon": url(require("style/icons/menuMixerDark.svg")),
  "ln-invoice-icon": url(require("style/icons/lnInvoiceIcon.svg")),
  "right-arrow": url(require("style/icons/rightArrowDark.svg")),
  "lightning-icon": url(require("style/icons/lightningIcon.svg")),
  "lookup-icon": url(require("style/icons/lookupIcon.svg")),
  "plus-icon": url(require("style/icons/plusIcon.svg")),
  "ln-confirmed-balance-icon": url(
    require("style/icons/LNConfirmedBalanceIcon.svg")
  ),
  "ln-unconfirmed-balance-icon": url(
    require("style/icons/LNUnconfirmedBalanceIcon.svg")
  ),
  "ln-total-account-balance-icon": url(
    require("style/icons/LNTotalAccountBalanceIcon.svg")
  ),
  "ln-open-channels-icon": url(require("style/icons/LNOpenChannelsIcon.svg")),
  "ln-capacity-icon": url(require("style/icons/LNCapacityIcon.svg")),
  "ln-nodes-icon": url(require("style/icons/LNNodesIcon.svg")),
  "ln-channels-icon": url(require("style/icons/LNChannelsIcon.svg")),
  "ln-network-capacity-icon": url(
    require("style/icons/LNNetworkCapacityIcon.svg")
  )
};

export default darkTheme;
