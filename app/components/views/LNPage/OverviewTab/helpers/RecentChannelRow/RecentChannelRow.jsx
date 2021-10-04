import { FormattedMessage as T } from "react-intl";
import { Balance, LNChannelStatus, TruncatedText } from "shared";
import styles from "./RecentChannelRow.module.css";
import { classNames } from "pi-ui";

const RecentChannelRow = ({ channel, tsDate, onClick }) => {
  const isClose = channel.closingTxHash === channel.tx.txHash;
  return (
    <div className={styles.channelRow} onClick={onClick}>
      <div>
        <div className={classNames(styles.value, isClose && styles.close)}>
          {isClose ? (
            <T
              id="ln.overviewTab.recentChannel.closed"
              m="Channel Closed {balance}"
              values={{
                balance: (
                  <Balance
                    amount={channel.settledBalance}
                    classNameWrapper={styles.balance}
                  />
                )
              }}
            />
          ) : (
            <T
              id="ln.overviewTab.recentChannel.value"
              m="Channel Funding {balance}"
              values={{
                balance: (
                  <Balance
                    amount={channel.tx.amount}
                    classNameWrapper={styles.balance}
                  />
                )
              }}
            />
          )}
          <div className={styles.channelPoint}>
            <TruncatedText text={channel.channelPoint} max={40} />
          </div>
        </div>
      </div>
      <div className={styles.status}>
        <LNChannelStatus channel={channel} />
      </div>
      <div className={styles.date}>
        <T
          id="ln.overviewTab.recentChannel.ts"
          m="{ts, date, medium} {ts, time, short}"
          values={{ ts: tsDate(channel.sortTs) }}
        />
      </div>
    </div>
  );
};

export default RecentChannelRow;
