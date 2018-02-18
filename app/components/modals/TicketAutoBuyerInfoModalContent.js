import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="ticketAutoBuyer.info.balanceToMaintain.header" m="Balance to Maintain" /></span>
        <span className="info-modal-row-text"><T id="ticketAutoBuyer.info.balanceToMaintain.message" m="If your balance is lower than this number, you will not buy tickets. The default of 0 will use all the funds in your account to buy tickets." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="ticketAutoBuyer.info.maxFee.header" m="Max Fee" /></span>
        <span className="info-modal-row-text"><T id="ticketAutoBuyer.info.maxFee.message" m="Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="ticketAutoBuyer.info.maxPriceAbsolute.header" m="Max Price Absolute" /></span>
        <span className="info-modal-row-text"><T id="ticketAutoBuyer.info.maxPriceAbsolute.message" m="If the ticket price is above this value, you will not buy more tickets. The default of 0 turns this off." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="ticketAutoBuyer.info.maxPriceRelative.header" m="Max Price Relative" /></span>
        <span className="info-modal-row-text"><T id="ticketAutoBuyer.info.maxPriceRelative.message" m="This number sets the max price to purchase tickets based on the observed average price multiplied by this number.  e.g. If the average price is 100, and this was set to 1.25, then the max price to purchase tickets would be 125 Hx. " /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="ticketAutoBuyer.info.maxPerBlock.header" m="Max Per Block" /></span>
        <span className="info-modal-row-text"><T id="ticketAutoBuyer.info.maxPerBlock.message" m="Do not buy more than this number of tickets per block. A negative number means buy one ticket every n blocks. e.g. -2 would mean buy a ticket every second block." /></span>
      </span>
    </p>
  </Aux>
);
