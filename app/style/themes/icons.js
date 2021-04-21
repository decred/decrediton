// url converts from the the webpack-genetered asset url into a css url directive.
const url = (s) => `url('${s}')`;

const icons = {
  "chat-bubbles": url(require("style/icons/chatBubbles.svg")),
  "ticket-voted-grey-icon": url(require("style/icons/votingGrey.svg")),
  "account-rename-icon": url(require("style/icons/account-rename.svg")),
  "accounts-button-icon": url(require("style/icons/accountInButton.svg")),
  "add-icon": url(require("style/icons/add.svg")),
  "agenda-card-kebab-disabled": url(
    require("style/icons/tickets-agenda-card-kebab-disabled.svg")
  ),
  "agenda-card-kebab-hover": url(
    require("style/icons/tickets-agenda-card-kebab-hover.svg")
  ),
  "agenda-indicator-finished": url(
    require("style/icons/indicator-finished.svg")
  ),
  "agenda-indicator-pending": url(require("style/icons/indicator-pending.svg")),
  "agenda-stripe": url(require("style/icons/stripe.svg")),
  "arrow-down-key-blue-icon": url(
    require("style/icons/arrow-down-key-blue.svg")
  ),
  "arrow-down-mid-blue-icon": url(
    require("style/icons/arrow-down-mid-blue.svg")
  ),
  "arrow-right-blue-icon": url(require("style/icons/arrow-right-key-blue.svg")),
  "arrow-right-key-blue-icon": url(
    require("style/icons/arrow-right-key-blue.svg")
  ),
  "arrow-left-white": url(require("style/icons/arrow-left-white.svg")),
  "bell-notification-icon": url(require("style/icons/bell-notification.svg")),
  "buy-decred-icon": url(require("style/icons/buy-decred.svg")),
  "checkmark-blue-icon": url(require("style/icons/checkmarkBlue.svg")),
  "checkmark-grey-icon": url(require("style/icons/checkmarkGrey.svg")),
  "checkmark-context-icon": url(
    require("style/icons/checkMarkContextMenu.svg")
  ),
  "change-password-default-icon": url(
    require("style/icons/changepasswordDefault.svg")
  ),
  "close-wallet-icon": url(require("style/icons/closeWallet.svg")),
  "contextbutton-eye-disabled-icon": url(
    require("style/icons/contextbutton-eye-disabled.svg")
  ),
  "delete-icon": url(require("style/icons/delete.svg")),
  "decred-macos-1024-logo": url(
    require("style/icons/decred-macos-1024-logo.png")
  ),
  "dummy-icon": url(require("style/icons/dummy-icon.svg")),
  "disable-spv": url(require("style/icons/disableSpv.svg")),
  "enable-spv": url(require("style/icons/enableSpv.svg")),
  "flag-ar": url(require("style/icons/ar-flag.svg")),
  "flag-au": url(require("style/icons/au-flag.svg")),
  "flag-de": url(require("style/icons/de-flag.svg")),
  "flag-en": url(require("style/icons/eng-flag.svg")),
  "flag-es": url(require("style/icons/es-flag.svg")),
  "flag-fr": url(require("style/icons/fr-flag.svg")),
  "flag-gb": url(require("style/icons/gb-flag.svg")),
  "flag-it": url(require("style/icons/it-flag.svg")),
  "flag-ja": url(require("style/icons/ja-flag.svg")),
  "flag-pl": url(require("style/icons/pl-flag.svg")),
  "flag-ptbr": url(require("style/icons/ptbr-flag.svg")),
  "flag-zh": url(require("style/icons/zh-flag.svg")),
  "flag-hk": url(require("style/icons/hk-flag.svg")),
  "generate-addr-icon": url(require("style/icons/generate-address.svg")),
  "hide-account-icon": url(require("style/icons/account-eye-hide.svg")),
  "info-warning-icon": url(require("style/icons/info-warning.svg")),
  "indicator-confirmed-icon": url(
    require("style/icons/indicator-confirmed.svg")
  ),
  "indicator-invalid-icon": url(require("style/icons/indicator-invalid.svg")),
  "indicator-pending-icon": url(require("style/icons/indicator-pending.svg")),
  "launcher-wallet-delete": url(
    require("style/icons/LauncherWalletDelete.svg")
  ),
  "launcher-wallet-delete-hover": url(
    require("style/icons/LauncherWalletDeleteHover.svg")
  ),
  "legend-available": url(require("style/icons/availLegend.svg")),
  "legend-locked": url(require("style/icons/lockedLegend.svg")),
  "legend-sent": url(require("style/icons/sentLegend.svg")),
  "legend-received": url(require("style/icons/receivedLegend.svg")),
  "legend-active": url(require("style/icons/activeLegend.svg")),
  "legend-voted": url(require("style/icons/votedLegend.svg")),
  "lifecycle-01": url(require("style/icons/lifecycle-01.png")),
  "lifecycle-02": url(require("style/icons/lifecycle-02.png")),
  "lifecycle-03": url(require("style/icons/lifecycle-03.png")),
  "lifecycle-04": url(require("style/icons/lifecycle-04.png")),
  "lifecycle-05": url(require("style/icons/lifecycle-05.png")),
  "lifecycle-06": url(require("style/icons/lifecycle-06.png")),
  "manage-pools-icon": url(
    require("style/icons/tickets-manage-stakepools.svg")
  ),
  "minus-big-icon": url(require("style/icons/minus-big.svg")),
  "minus-small-icon": url(require("style/icons/minus-small.svg")),
  "new-loader": url(require("style/icons/3D_Loading.gif")),
  "no-tickets-icon": url(require("style/icons/no-tickets.svg")),
  "notification-success-icon": url(
    require("style/icons/notificationSuccess.svg")
  ),
  "notification-error-icon": url(require("style/icons/notificationError.svg")),
  "password-inactive-icon": url(require("style/icons/passwordInactive.svg")),
  "pending-animation": url(require("style/icons/pending_dots.gif")),
  "plus-big-icon": url(require("style/icons/plus-big.svg")),
  "plus-small-icon": url(require("style/icons/plus-small.svg")),
  "rebroadcast-transaction-icon": url(
    require("style/icons/rebroadcastTransaction.svg")
  ),
  "restore-wallet-icon": url(require("style/icons/restorewallet.svg")),
  "send-all-disabled": url(require("style/icons/sendMaxDisabled.svg")),
  "show-account-icon": url(require("style/icons/account-eye-open.svg")),
  "stakey-sprites-icon": url(require("style/icons/stakeySprites.png")),
  "staking-01-icon": url(require("style/icons/warrior.png")),
  "stats-disabled-icon": url(require("style/icons/stats-disabled.svg")),
  "ticket-expired-icon": url(require("style/icons/ticket-expired.svg")),
  "ticket-immature-icon": url(require("style/icons/ticket-immature.svg")),
  "ticket-lifecycle-icon": url(require("style/icons/ticket-lifecycle.svg")),
  "ticket-live-icon": url(require("style/icons/ticket-live.svg")),
  "ticket-missed-icon": url(require("style/icons/ticket-missed.svg")),
  "ticket-revoked-icon": url(require("style/icons/ticket-revoked.svg")),
  "ticket-small-icon": url(require("style/icons/tickets-ticket.svg")),
  "ticket-unmined-icon": url(require("style/icons/ticket-unmined.svg")),
  "tickets-minus-icon": url(require("style/icons/ticketsMinusWhite.svg")),
  "tickets-plus-icon": url(require("style/icons/ticketsPlusWhite.svg")),
  "ticket-voted-icon": url(require("style/icons/ticket-voted.svg")),
  "tickets-cogs-closed-icon": url(
    require("style/icons/tickets-cogs-closed.svg")
  ),
  "ticketfee-transaction-icon": url(
    require("style/icons/ticketFeeTransaction.svg")
  ),
  "warning-input-icon": url(
    require("style/icons/warningExclamationOrange.svg")
  ),
  "what-is-staking-icon": url(require("style/icons/what-is-staking.svg")),
  "watch-only-icon": url(require("style/icons/watchOnlyNav.svg")),
  "x-white-icon": url(require("style/icons/closeWhite.svg")),
  "show-pubkey-icon": url(require("style/icons/accountShowWhite.svg")),
  "hide-pubkey-icon": url(require("style/icons/accountHideWhite.svg")),
  "loader-animation-blockchain-syncing": url(
    require("style/icons/blockchain_syncing_loader.gif")
  ),
  "loader-animation-daemon-waiting": url(
    require("style/icons/daemon_waiting_loader.gif")
  ),
  "loader-animation-discovering-addresses": url(
    require("style/icons/discovering_addresses_loader.gif")
  ),
  "loader-animation-establishing-rpc": url(
    require("style/icons/establishing_rpc_loader.gif")
  ),
  "loader-animation-fetching-headers": url(
    require("style/icons/fetching_headers_loader.gif")
  ),
  "loader-animation-finalizing-setup": url(
    require("style/icons/finalizing_setup_loader.gif")
  ),
  "loader-animation-scanning-blocks": url(
    require("style/icons/scanning_blocks_loader.gif")
  ),
  "menu-animation-syncing": url(require("style/animations/syncingMotion.gif")),
  "release-image-v130": url(require("style/icons/release-note-v130.gif")),
  "release-image-v140": url(require("style/icons/release-note-v140.gif")),
  "release-image-v150": url(require("style/icons/release-note-v150.png")),
  "release-image-v160": url(require("style/icons/release-note-v160.png")),
  "tickets-loading-more-icon": url(
    require("style/icons/ticket_live_loop_decrediton_grey.gif")
  ),
  "qr-icon": url(require("style/icons/qr-logo.svg")),
  "ticket-expired": url(require("style/icons/ticketExpired.svg")),
  "ticket-immature": url(require("style/icons/ticketImmature.svg")),
  "ticket-live": url(require("style/icons/ticketLive.svg")),
  "ticket-missed": url(require("style/icons/ticketMissed.svg")),
  "ticket-revoked": url(require("style/icons/ticketRevoked.svg")),
  "ticket-unmined": url(require("style/icons/ticketUnmined.svg")),
  "ticket-voted": url(require("style/icons/ticketVoted.svg")),
  "delete-vsp": url(require("style/icons/deleteVSP.svg")),
  "view-qr-icon": url(require("style/icons/showQR.svg")),
  "share-icon": url(require("style/icons/share.svg")),
  "decred-logo": url(require("style/icons/dcrLogoShare.svg")),
  "search-icon-hover": url(require("style/icons/search-hover.svg")),
  "animated-alert-icon": url(require("style/icons/animated_alert_icon.gif")),
  "mixed-transaction-icon": url(require("style/icons/mixedTx.svg"))
};

export default icons;
