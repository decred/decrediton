import "style/MiscComponents.less";

const TicketsCogs = ({ opened, onClick }) => (
  <a className={opened ? "ticket-cogs-opened" : "ticket-cogs-closed"} onClick={onClick} />
);

export default TicketsCogs;
