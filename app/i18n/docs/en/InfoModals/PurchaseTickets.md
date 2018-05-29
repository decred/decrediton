# Ticket Purchase Information

**Account** This is the account that will purchase the tickets and receive the reward.

**Number of tickets** The number of tickets to attempt to purchase.

**Ticket fee (DCR/kB** Tickets are entered into the voting pool by order of their fee. In times of demand, you will need to increase this value in order to have your tickets accepted. You can view current ticket fees here.

**Ticket price** The current price of a ticket as calculated by the network.  Changes every 144 Blocks.

**Stake pool preference** Automate setup with PoS pools. See below for more information.

**Expiry (blocks)** Often ticket fees will increase during a window and you may be stopped out by higher fees. By setting an expiry, tickets that are not mined in the given number of blocks are cancelled so you can try again with higher fees if you wish. If this is empty, they will not expire until the end of the window.

**Tx fee (DCR/kB)** Decrediton uses a "split" transaction to avoid blocking your balance, spliting the exact amount needed for the ticket from the balance in your wallet. The "split" transaction needs to be confirmed at least once before you can reuse your balance. This can block your whole balance for several minutes while this confirmation occurs. Without the split, you would have to wait for the confirmation of the ticket transaction, which could take several hours. This can be left at 0.01. It does not affect your chances of buying tickets or voting with them.

**Voting address** The Decred address that will do the voting.

**Pool fee address** The address that your stakepool fee will end up getting paid.

**Pool fees (%)** The fee in which you will be charged for using the stakepool's service.
