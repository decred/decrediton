import TicketInfoCard from "./TicketInfoCard";

const TicketsCardList = ({ tickets, expandedTicket }) => {
  console.log("Re-rendering ticket card list");
  return (<div className="tickets-list">
    {tickets.map(ticket => {
      //const key = ticket.hash;
      const key = ticket.ticket.getHash();
      const expanded = ticket === expandedTicket;
      return <TicketInfoCard {...{ key, ticket, expanded }}  />;
    })}
  </div>);
};

export default TicketsCardList;

//onClick={this.onInfoCardClick}
