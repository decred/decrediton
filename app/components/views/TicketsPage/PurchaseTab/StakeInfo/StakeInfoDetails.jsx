import { FormattedNumber, FormattedMessage as T } from "react-intl";
import styles from "./StakeInfo.module.css";

const StakeInfoTicketCount = ({ className, label, value }) => (
  <div className={styles.detail}>
    <div className={`${styles.detailIcon} ${className}`}></div>
    <span className={styles.detailLabel}>{label}</span>
    <span className={styles.detailValue}>{value}</span>
  </div>
);

const StakeInfoDisplay = ({
  votedTicketsCount,
  revokedTicketsCount,
  expiredTicketsCount,
  immatureTicketsCount,
  ownMempoolTicketsCount,
  liveTicketsCount
}) => (
  <div className={styles.detailsBorder}>
    <div className={styles.details}>
      <StakeInfoTicketCount
        className={styles.detailIconUnmined}
        label={<T id="stakeSPV.votedTickets" m="Own Mempool Tickets:" />}
        value={<FormattedNumber value={ownMempoolTicketsCount} />}
      />
      <StakeInfoTicketCount
        className={styles.detailIconImmature}
        label={<T id="stakeSPV.expiredTickets" m="Immature Tickets:" />}
        value={<FormattedNumber value={immatureTicketsCount} />}
      />
      <StakeInfoTicketCount
        className={styles.detailIconLive}
        label={<T id="stakeSPV.revokedTickets" m="Live Tickets:" />}
        value={<FormattedNumber value={liveTicketsCount} />}
      />
      <StakeInfoTicketCount
        className={styles.detailIconVoted}
        label={<T id="stake.mempoolTickets" m="Voted Tickets:" />}
        value={<FormattedNumber value={votedTicketsCount} />}
      />
      <StakeInfoTicketCount
        className={styles.detailIconExpired}
        label={<T id="stake.poolSize" m="Expired Tickets:" />}
        value={<FormattedNumber value={expiredTicketsCount} />}
      />
      <StakeInfoTicketCount
        className={styles.detailIconRevoked}
        label={<T id="stake.missedTickets" m="Revoked Tickets:" />}
        value={<FormattedNumber value={revokedTicketsCount} />}
      />
    </div>
  </div>
);

export default StakeInfoDisplay;
