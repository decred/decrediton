# Before Creating an LN Wallet

[Lightning Network](https://docs.decred.org/lightning-network/overview/) is still a work in progress in Decred.

While based on the popular `lnd` implementation, it has significant differences and has seen less widespread test than the Bitcoin network, so use with caution.

In particular:

- Understand that [backup data](https://docs.decred.org/lightning-network/backups/) is needed _in addition to the seed_ to recover all LN funds.

- LN has been implemented assuming that nodes (wallets) are online most of the time so _episodic_ wallets (ones that remain online for very small amounts of time) may see degraded ability to send and receive payments.

- Understand that a malicious counter-party may steal funds from _episodic_ wallets unless they use a [watchtower](https://docs.decred.org/lightning-network/watchtowers/) service.

- You can only send and receive payments up to the amount available in your published channels, which usually requires up to 6 confirmations (blocks) in the network for them to be available.

- The corresponding account used for LN operations remains _unlocked_ while the LN wallet is running, so funds from that account are at risk from anyone with remote or physical access to the computer.

One recommendation is to use a separate account (or better yet, a separate _wallet_) with a small amount of funds to minimize the possibility of loss of funds.
