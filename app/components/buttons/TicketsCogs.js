import "style/MiscComponents.less";

const TicketsCogs = ({ opened, onClick }) => (
  <div>
    <a className={opened ? "ticket-cogs-opened" : "ticket-cogs-closed"} onClick={onClick} />
  </div>
);

export default TicketsCogs;
