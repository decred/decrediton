import styles from "./TicketsCogs.module.css";

const TicketsCogs = ({ opened, onClick }) => (
  <button
    className={opened ? styles.ticketCogsOpened : styles.ticketCogsClosed}
    onClick={onClick}/>);

export default TicketsCogs;
