const TicketCard = ({ status, children, onClick, className }) => {
  const thisClsName = "ticket-card ticket-" + status +
    (className ? " " + className : "");

  return (
    <div {...{ onClick }} className={thisClsName}>
      {children}
    </div>
  );
};

export default TicketCard;
