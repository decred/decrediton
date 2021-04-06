import styles from "./NotVotingMsg.module.css";

const NotVotingMsg = ({ children }) => (
  <div className={styles.notVoting}>{children}</div>
);

export default NotVotingMsg;
