import { AutoBuyerSwitch, InfoModalButton, PassphraseModalSwitch, TicketsCogs } from "buttons";
import { TicketAutoBuyerInfoModalContent } from "modals";
import { TransitionMotionWrapper } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const TicketAutoBuyerForm = ({
  isHidingDetails,
  onStartAutoBuyer,
  onDisableTicketAutoBuyer,
  onToggleShowDetails,
  isTicketAutoBuyerEnabled,
  getNullStyles,
  getDetailsComponent
}) => (
  <Aux>
    <div className="stakepool-voting-title-area">
      <div className="stakepool-purchase-ticket-input-buttons">
        <InfoModalButton
          modalTitle={<h1><T id="accounts.automaticPurchaseInfo" m="Automatic Purchase Information" /></h1>}
          modalContent={<TicketAutoBuyerInfoModalContent />}
        />
      </div>
    </div>
    <div className="stakepool-flex-height-auto-buyer-wrapper">
      <div className="stakepool-auto-buyer-row">
        {isTicketAutoBuyerEnabled ?
          <AutoBuyerSwitch enabled onClick={onDisableTicketAutoBuyer} /> :
          <PassphraseModalSwitch
            modalTitle={<T id="tickets.startAutoBuyerConfirmation" m="Start Ticket Buyer Confirmation" />}
            modalDescription={
              <div>
                <span className="orange-warning"><T id="tickets.startAutoBuyerConfirmation.attention" m="Attention!" /></span>
                <T id="tickets.startAutoBuyerConfirmation.description" m="Decrediton must remain running for tickets to be automatically purchased." />
              </div>}
            onSubmit={onStartAutoBuyer}
          />
        }
        <div className="stakepool-auto-buyer-quick-bar-row">
          <T id="autobuyer.title2" m="Automatic Ticket Buyer" />
        </div>
        <div className="stakepool-purchase-ticket-input-buttons">
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
