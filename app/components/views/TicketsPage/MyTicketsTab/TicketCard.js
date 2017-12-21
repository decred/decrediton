const TicketCard = ({ status, children, onClick, onMouseEnter, className }) => {
  const thisClsName = "ticket-card ticket-" + status +
    (className ? " " + className : "");

  return (
    <div {...{onClick, onMouseEnter}} className={thisClsName}>
      {children}
    </div>
  );
};

export default TicketCard;
