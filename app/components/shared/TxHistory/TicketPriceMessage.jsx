import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";

const TicketPriceMessage = React.memo(({ ticketPrice }) => (
  <T
    id="ticket.priceMessage"
    m={"{ticketPriceLabel}: {ticketPrice}"}
    values={{
      ticketPriceLabel: <T id="ticket.priceLabel" m="Ticket Price" />,
      ticketPrice: <Balance amount={ticketPrice || 0} />
    }}
  />
));

export default TicketPriceMessage;
