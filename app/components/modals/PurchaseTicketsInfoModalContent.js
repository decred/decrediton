import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <div className="purchase-tickets-column">
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.account.header" m="Account" /></span> - <T id="tickets.info.account.message" m="This is the account that will purchase the tickets and receive the reward." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.number.header" m="Number of tickets" /></span> - <T id="tickets.info.number.message" m="The number of tickets to attempt to purchase." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.ticketFee.header" m="Ticket fee (DCR/kB)" /></span> - <T id="tickets.info.ticketFee.message" m="Tickets are entered into the voting pool by order of their fee. In times of demand, you will need to increase this value in order to have your tickets accepted. You can view current ticket fees here." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.ticketPrice.header" m="Ticket price" /></span> - <T id="tickets.info.ticketPrice.message" m="The current price of a ticket as calculated by the network.  Changes every 144 Blocks." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.poolPreference.header" m="Stake pool preference" /></span> - <T id="tickets.info.poolPreference.message" m="Automate setup with PoS pools. See below for more information." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.expiry.header" m="Expiry (blocks)" /></span> - <T id="tickets.info.expiry.message" m="Often ticket fees will increase during a window and you may be stopped out by higher fees. By setting an expiry, tickets that are not mined in the given number of blocks are cancelled so you can try again with higher fees if you wish. If this is empty, they will not expire until the end of the window." />
      </div>
    </div>
    <div className="purchase-tickets-column">
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.txFee.header" m="Tx fee (DCR/kB)" /></span> - <T id="tickets.info.txFee.message" m="Decrediton uses a &quot;split&quot; transaction to avoid blocking your balance, spliting the exact amount needed for the ticket from the balance in your wallet. The &quot;split&quot; transaction needs to be confirmed at least once before you can reuse your balance. This can block your whole balance for several minutes while this confirmation occurs. Without the split, you would have to wait for the confirmation of the ticket transaction, which could take several hours. This can be left at 0.01. It does not affect your chances of buying tickets or voting with them." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.votingAddress.header" m="Voting address" /></span> - <T id="tickets.info.votingAddress.message" m="The Decred address that will do the voting." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.poolFeeAddress.header" m="Pool fee address" /></span> - <T id="tickets.info.poolFeeAddress.message" m="The address that your stakepool fee will end up getting paid." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="tickets.info.poolFeePercentage.header" m="Pool fees (%)" /></span> - <T id="tickets.info.poolFeePercentage.message" m="The fee in which you will be charged for using the stakepool's service." />
      </div>
    </div>
  </Aux>
);
