import { AutoBuyerSwitch, InfoModalButton, PassphraseModalSwitch, TicketsCogs } from "buttons";
import { TicketAutoBuyerInfoModalContent } from "modals";
import { Tooltip, TransitionMotionWrapper } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const TicketAutoBuyerForm = ({
  isHidingDetails,
  balanceToMaintain,
  maxFee,
  maxPriceAbsolute,
  maxPriceRelative,
  maxPerBlock,
  onStartAutoBuyer,
  onDisableTicketAutoBuyer,
  onToggleShowDetails,
  isTicketAutoBuyerEnabled,
  getNullStyles,
  getDetailsComponent
}) => (
  <Aux>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">
        <T id="autobuyer.title" m="Automatic Purchase" /></div>
    </div>
    <div className="stakepool-flex-height-auto-buyer-wrapper">
      <div className="stakepool-auto-buyer-row">
        {isTicketAutoBuyerEnabled ?
          <AutoBuyerSwitch enabled onClick={onDisableTicketAutoBuyer} /> :
          <PassphraseModalSwitch
            modalTitle={<T id="tickets.startAutoBuyerConfirmation" m="Start Ticket Buyer Confirmation" />}
            onSubmit={onStartAutoBuyer}
          />
        }
        <div className="stakepool-auto-buyer-quick-bar-row">
          {isHidingDetails ? (
            <div>
              <Tooltip text={<T id="autobuyer.balanceToMaintain" m="Balance to Maintain" />}>
                <div className="stakepool-balance-to-maintain-icon">{balanceToMaintain}</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxFee" m="Max Fee" />}>
                <div className="stakepool-max-fee-icon">{maxFee} Hx</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxPriceAbsolute" m="Max Price Absolute" />}>
                <div className="stakepool-max-price-absolute-icon">{maxPriceAbsolute} Hx</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxPriceRelative" m="Max Price Relative" />}>
                <div className="stakepool-max-price-relative-icon">{maxPriceRelative}%</div>
              </Tooltip>
              <Tooltip text={<T id="autobuyer.maxPerBlock" m="Max Per Block" />}>
                <div className="stakepool-max-per-block-icon">{maxPerBlock}</div>
              </Tooltip>
            </div>
          ) : null}
        </div>
        <div className="stakepool-purchase-ticket-input-buttons">
          <InfoModalButton
            modalTitle={<h1><T id="accounts.automaticPurchaseInfo" m="Automatic Purchase Information" /></h1>}
            modalContent={<TicketAutoBuyerInfoModalContent />}
          />
          <TicketsCogs opened={isHidingDetails} onClick={onToggleShowDetails} />
        </div>
      </div>
      <TransitionMotionWrapper
        {
        ...{
          styles: isHidingDetails ? getNullStyles() : getDetailsComponent(),
        }}
      />
    </div>
  </Aux>
);

export default TicketAutoBuyerForm;
