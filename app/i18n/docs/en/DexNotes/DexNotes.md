Welcome to DCRDEX!

Although DCRDEX looks and feels like a regular exchange, there are important differences. Please read the Highlights and Important Notices at https://github.com/decred/dcrdex/blob/master/docs/release-notes/release-notes-0.2.0.md.

Trades do not settle instantly. Settlement happens on-chain, and requires multiple block confirmations. Depending on network conditions, this can take hours. The DEX software and external wallets like bitcoind MUST stay running until your trades have fully settled or refunded.

You must remain connected to the internet for the full duration of trade settlement. Loss of connectivity for several minutes is generally OK, but extended downtime may cause a swap may be revoked (forced to refund) and your booked orders to be canceled. Losing your connection to the DEX server does NOT put funds at risk. If you do need to restart the DEX software, be sure to login again immediately.

Always start external wallets first, and stop them last.

During a swap, if either you or the counterparty fail to act for any reason, the match may be revoked after a timeout. If you have such a revoked match, keep your DEX software and wallets running until refunds complete. This can be up to 20 hours depending on if you were the maker or taker.

For support, please visit the [#dex Matrix chat room](https://matrix.to/#/!mlRZqBtfWHrcmgdTWB:decred.org?via=decred.org&via=matrix.org&via=planetdecred.org).
