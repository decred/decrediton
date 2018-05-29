# Automatic Purchase Information

**Balance to Maintain** If your balance is lower than this number, you will not buy tickets. The default of 0 will use all the funds in your account to buy tickets

**Max Fee** Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay.

**Max Price Absolute** If the ticket price is above this value, you will not buy more tickets. The default of 0 turns this off.

**Max Price Relative** This number sets the max price to purchase tickets based on the observed average price multiplied by this number.  e.g. If the average price is 100, and this was set to 1.25, then the max price to purchase tickets would be 125 DCR.

**Max Per Block** Do not buy more than this number of tickets per block. A negative number means buy one ticket every n blocks. e.g. -2 would mean buy a ticket every second block.
