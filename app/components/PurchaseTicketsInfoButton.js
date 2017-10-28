import "style/MiscComponents.less";
import { Tooltip } from "shared";

const PurchaseTicketsInfoButton = ({ tooltipText, onClick }) => (
  <Tooltip tipWidth={ 120 } text={tooltipText}>
    <a className="purchase-tickets-info-button" onClick={onClick} />
  </Tooltip>
);

export default PurchaseTicketsInfoButton;
