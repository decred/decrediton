import { FormattedMessage as T } from "react-intl";

const TicketsCardList = ({ children }) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="myTickets.subtitle" m="My Tickets"/></div>
    <div className="tickets-list">
      {children}
    </div>
  </Aux>
);

export default TicketsCardList;
