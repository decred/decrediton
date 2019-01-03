import TicketInfoCard from "./TicketInfoCard";
import VisibilitySensor from "react-visibility-sensor";

const Card = ({ isVisible, ...props }) => {
  const { expanded, ticket, onClick } = props;
  const className = "ticket-info-card" + (expanded ? " is-expanded" : "") +
  " ticket-card ticket-" + ticket.status;

  return (
    <div className={className} onClick={() => onClick(ticket)}>
      {isVisible ? <TicketInfoCard {...props} /> : null}
    </div>
  );
};

export default (props) => (
  <VisibilitySensor partialVisibility={true} scrollCheck={true}>
    {({ isVisible }) => <Card isVisible={isVisible} {...props} />}
  </VisibilitySensor>
);
