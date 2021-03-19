import styles from "./TicketsCogs.module.css";

const TicketsCogs = ({ opened, onClick, ariaLabel }) => (
  <button
    aria-label={ariaLabel ? ariaLabel : "TicketsCogs"}
    className={opened ? styles.ticketCogsOpened : styles.ticketCogsClosed}
    onClick={onClick}/>);

export default TicketsCogs;
