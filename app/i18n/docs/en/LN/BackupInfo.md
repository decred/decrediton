# LN Wallet Backup Information

Due to its nature as a second-layer network, LN-related wallet data is **not**
stored in the blockchain itself. This means that the standard wallet seed is
**not sufficient** to restore the LN balance of a wallet in case of a re-seed.

LN users need to **also** regularly and safely store the _SCB file_ so that
a restored lightning wallet might be used to close the channels opened by the
previous wallet.

The backup should be updated every time a channel is opened or closed on the
local LN node (including when a _remote_ node opens a channel back to the local
node).

For more information on LN backups, please see the documentation at
https://docs.decred.org/lightning-network/backups/
