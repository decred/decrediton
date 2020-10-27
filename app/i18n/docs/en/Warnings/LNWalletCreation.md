# Before you continue...

Please understand that [Lightning Network](https://docs.decred.org/lightning-network/overview/)
is still work in progress and should be used with caution. In particular:

- Understand that [backup data](https://docs.decred.org/lightning-network/backups/) is needed _in addition to your wallet seed_ to recover all LN funds.

- LN has been implemented assuming that nodes (wallets) are online most of the time, so _episodic_ wallets (ones that remain online for very small amounts of time) may see degraded ability to send and receive payments.

- Understand that a malicious counter-party may steal funds from _episodic_ wallets unless they use a [watchtower](https://docs.decred.org/lightning-network/watchtowers/) service.

- You can only send and receive payments up to the amount available in your published channels, which usually requires up to 6 confirmations (blocks) to be available.

- The wallet account used for LN operations remains _unlocked_ while the LN wallet is running, so funds from that account are at risk from anyone with remote or physical access to your computer. It is recommended to use a separate account (or better yet, a separate _wallet_) with a small amount of funds to minimize the risk.
