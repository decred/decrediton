import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <div className="purchase-tickets-column">
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="ticketAutoBuyer.info.balanceToMaintain.header" m="Balance to Maintain" /></span> - <T id="ticketAutoBuyer.info.balanceToMaintain.message" m="If your balance is lower than this number, you will not buy tickets. The default of 0 will use all the funds in your account to buy tickets." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="ticketAutoBuyer.info.maxFee.header" m="Max Fee" /></span> - <T id="ticketAutoBuyer.info.maxFee.message" m="Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="ticketAutoBuyer.info.maxPriceAbsolute.header" m="Max Price Absolute" /></span> - <T id="ticketAutoBuyer.info.maxPriceAbsolute.message" m="If the ticket price is above this value, you will not buy more tickets. The default of 0 turns this off." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="ticketAutoBuyer.info.maxPriceRelative.header" m="Max Price Relative" /></span> - <T id="ticketAutoBuyer.info.maxPriceRelative.message" m="Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." />
      </div>
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header"><T id="ticketAutoBuyer.info.maxPerBlock.header" m="Max Per Block" /></span> - <T id="ticketAutoBuyer.info.maxPerBlock.message" m="Do not buy more than this number of tickets per block. A negative number means buy one ticket every n blocks. e.g. -2 would mean buy a ticket every second block." />
      </div>
    </div>
  </Aux>
);
