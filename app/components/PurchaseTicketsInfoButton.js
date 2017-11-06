import "style/MiscComponents.less";
import { Tooltip } from "shared";

const PurchaseTicketsInfoButton = ({ tooltipText, onClick }) => (
  <Tooltip text={tooltipText}>
    <a className="purchase-tickets-info-button" onClick={onClick} />
  </Tooltip>
);

export default PurchaseTicketsInfoButton;
