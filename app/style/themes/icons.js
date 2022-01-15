// url converts from the the webpack-genetered asset url into a css url directive.
const url = (s) => `url('${s}')`;

const icons = {
  "chat-bubbles": url(require("style/icons/chatBubbles.svg")),
  "ticket-voted-grey-icon": url(require("style/icons/votingGrey.svg")),
  "account-rename-icon": url(require("style/icons/account-rename.svg")),
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
  "close-wallet-icon": url(require("style/icons/closeWallet.svg")),
  "contextbutton-eye-disabled-icon": url(
    require("style/icons/contextbutton-eye-disabled.svg")
  ),
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
  "release-image-v170": url(require("style/icons/release-note-v170.gif")),
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
  "decred-logo": url(require("style/icons/dcrLogoShare.svg")),
  "search-icon-hover": url(require("style/icons/search-hover.svg")),
  "animated-alert-icon": url(require("style/icons/animated_alert_icon.gif")),
  "mixed-transaction-icon": url(require("style/icons/mixedTx.svg")),
  //
  // tutorials
  //
  // consensusCode
  "tutorial-consensusCode-thumb": url(
    require("style/icons/tutorials/consensusCode/thumb.svg")
  ),
  "tutorial-consensusCode-slide1-1": url(
    require("style/icons/tutorials/consensusCode/consensus-slide1-1.svg")
  ),
  "tutorial-consensusCode-slide1-2": url(
    require("style/icons/tutorials/consensusCode/consensus-slide1-2.svg")
  ),
  // LN
  "tutorial-ln-thumb": url(require("style/icons/tutorials/ln/thumb.svg")),
  "tutorial-ln-slide1": url(require("style/icons/tutorials/ln/ln-slide1.svg")),
  "tutorial-ln-slide2": url(require("style/icons/tutorials/ln/ln-slide2.svg")),
  "tutorial-ln-slide3": url(require("style/icons/tutorials/ln/ln-slide3.svg")),
  "tutorial-ln-slide4": url(require("style/icons/tutorials/ln/ln-slide4.svg")),
  "tutorial-ln-slide5": url(require("style/icons/tutorials/ln/ln-slide5.svg")),
  "tutorial-ln-slide6": url(require("style/icons/tutorials/ln/ln-slide6.svg")),
  // decredIntro
  "tutorial-decredIntro-thumb": url(
    require("style/icons/tutorials/decredIntro/thumb.svg")
  ),
  "tutorial-decredIntro-slide1": url(
    require("style/icons/tutorials/decredIntro/intro-slide1.svg")
  ),
  "tutorial-decredIntro-slide2-1": url(
    require("style/icons/tutorials/decredIntro/intro-slide2-1.svg")
  ),
  "tutorial-decredIntro-slide2-2": url(
    require("style/icons/tutorials/decredIntro/intro-slide2-2.svg")
  ),
  // powPos
  "tutorial-powPos-thumb": url(
    require("style/icons/tutorials/powPos/thumb.svg")
  ),
  "tutorial-powPos-slide1": url(
    require("style/icons/tutorials/powPos/pos-pow-slide1.svg")
  ),
  "tutorial-powPos-slide2": url(
    require("style/icons/tutorials/powPos/pos-pow-slide2.svg")
  ),
  "tutorial-powPos-slide3": url(
    require("style/icons/tutorials/powPos/pos-pow-slide3.svg")
  ),
  // tickets
  "tutorial-tickets-thumb": url(
    require("style/icons/tutorials/tickets/thumb.svg")
  ),
  "tutorial-tickets-slide1": url(
    require("style/icons/tutorials/tickets/tickets-slide1.svg")
  ),
  "tutorial-tickets-slide2-1": url(
    require("style/icons/tutorials/tickets/tickets-slide2-1.svg")
  ),
  "tutorial-tickets-slide2-2": url(
    require("style/icons/tutorials/tickets/tickets-slide2-2.svg")
  ),
  "tutorial-tickets-slide3-1": url(
    require("style/icons/tutorials/tickets/tickets-slide3-1.svg")
  ),
  "tutorial-tickets-slide3-2": url(
    require("style/icons/tutorials/tickets/tickets-slide3-2.svg")
  ),
  // staking
  "tutorial-staking-thumb": url(
    require("style/icons/tutorials/staking/thumb.svg")
  ),
  "tutorial-staking-slide1": url(
    require("style/icons/tutorials/staking/staking-slide1.svg")
  ),
  "tutorial-staking-slide2": url(
    require("style/icons/tutorials/staking/staking-slide2.svg")
  ),
  "tutorial-staking-slide3-1": url(
    require("style/icons/tutorials/staking/staking-slide3-1.svg")
  ),
  "tutorial-staking-slide3-2": url(
    require("style/icons/tutorials/staking/staking-slide3-2.svg")
  ),
  "tutorial-staking-slide4-1": url(
    require("style/icons/tutorials/staking/staking-slide4-1.svg")
  ),
  "tutorial-staking-slide4-2": url(
    require("style/icons/tutorials/staking/staking-slide4-2.svg")
  ),
  // blocks
  "tutorial-blocks-thumb": url(
    require("style/icons/tutorials/blocks/thumb.svg")
  ),
  "tutorial-blocks-slide1": url(
    require("style/icons/tutorials/blocks/blocks-slide1.svg")
  ),
  "tutorial-blocks-slide2": url(
    require("style/icons/tutorials/blocks/blocks-slide2.svg")
  ),
  "tutorial-blocks-slide3": url(
    require("style/icons/tutorials/blocks/blocks-slide3.svg")
  ),
  "tutorial-blocks-slide4": url(
    require("style/icons/tutorials/blocks/blocks-slide4.svg")
  ),
  "tutorial-blocks-slide5": url(
    require("style/icons/tutorials/blocks/blocks-slide5.svg")
  ),
  // consensusVoting
  "tutorial-consensusVoting-thumb": url(
    require("style/icons/tutorials/consensusVoting/thumb.svg")
  ),
  "tutorial-consensusVoting-slide1": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide1.svg")
  ),
  "tutorial-consensusVoting-slide2": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide2.svg")
  ),
  "tutorial-consensusVoting-slide3": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide3.svg")
  ),
  "tutorial-consensusVoting-slide4": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide4.svg")
  ),
  "tutorial-consensusVoting-slide5": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide5.svg")
  ),
  "tutorial-consensusVoting-slide6": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide6.svg")
  ),
  "tutorial-consensusVoting-slide7": url(
    require("style/icons/tutorials/consensusVoting/consensusvoting-slide7.svg")
  ),
  // lifecycle
  "tutorial-lifecycle-thumb": url(
    require("style/icons/tutorials/lifecycle/thumb.svg")
  ),
  "tutorial-lifecycle-slide1-1": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide1-1.svg")
  ),
  "tutorial-lifecycle-slide1-2": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide1-2.svg")
  ),
  "tutorial-lifecycle-slide2": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide2.svg")
  ),
  "tutorial-lifecycle-slide3-1": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide3-1.svg")
  ),
  "tutorial-lifecycle-slide3-2": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide3-2.svg")
  ),
  "tutorial-lifecycle-slide4-1": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide4-1.svg")
  ),
  "tutorial-lifecycle-slide4-2": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide4-2.svg")
  ),
  "tutorial-lifecycle-slide5-1": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide5-1.svg")
  ),
  "tutorial-lifecycle-slide5-2": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide5-2.svg")
  ),
  "tutorial-lifecycle-slide5-3": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide5-3.svg")
  ),
  "tutorial-lifecycle-slide5-4": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide5-4.svg")
  ),
  "tutorial-lifecycle-slide6-1": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide6-1.svg")
  ),
  "tutorial-lifecycle-slide6-2": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide6-2.svg")
  ),
  "tutorial-lifecycle-slide6-3": url(
    require("style/icons/tutorials/lifecycle/lifecycle-slide6-3.svg")
  ),
  // identity
  "tutorial-identity-slide1": url(
    require("style/icons/tutorials/identity/identity-slide1.svg")
  ),
  "tutorial-identity-slide2": url(
    require("style/icons/tutorials/identity/identity-slide2.svg")
  ),
  "tutorial-identity-slide3": url(
    require("style/icons/tutorials/identity/identity-slide3.svg")
  ),
  "tutorial-identity-slide4": url(
    require("style/icons/tutorials/identity/identity-slide4.svg")
  )
};

export default icons;
