import styles from "./NoTicketsMsg.module.css";

const NoTicketsMsg = ({ children }) => (
  <div className={styles.noTickets}>{children}</div>
);

export default NoTicketsMsg;
