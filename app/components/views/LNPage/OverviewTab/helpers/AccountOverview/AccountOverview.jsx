import { FormattedMessage as T } from "react-intl";
import styles from "./AccountOverview.module.css";
import { Balance } from "shared";
import { classNames } from "pi-ui";

const GridItem = ({ className, label, value }) => (
  <div className={classNames(styles.item, className)}>
    <div className={styles.icon} />
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

const AccountOverview = ({
  walletBalances,
  channelsCount,
  channelsCapacity
}) => (
  <div className={styles.grid}>
    <GridItem
      className={styles.confirmedBalance}
      label={
        <T
          id="ln.overviewTab.accountOverview.confirmedBalance"
          m="Confirmed Balance"
        />
      }
      value={
        <Balance
          noSmallAmount
          flat
          amount={walletBalances.confirmedBalance}
          classNameWrapper={styles.balance}
          classNameSecondary={styles.balanceSecondary}
          classNameUnit={styles.balanceUnit}
        />
      }
    />
    <GridItem
      className={styles.unconfirmedBalance}
      label={
        <T
          id="ln.overviewTab.accountOverview.unconfirmedBalance"
          m="Unconfirmed Balance"
        />
      }
      value={
        <Balance
          noSmallAmount
          flat
          amount={walletBalances.unconfirmedBalance}
          classNameWrapper={styles.balance}
          classNameSecondary={styles.balanceSecondary}
          classNameUnit={styles.balanceUnit}
        />
      }
    />
    <GridItem
      className={styles.totalAccountBalance}
      label={
        <T
          id="ln.overviewTab.accountOverview.totalAccountBalance"
          m="Total Account Balance"
        />
      }
      value={
        <Balance
          noSmallAmount
          flat
          amount={walletBalances.totalBalance}
          classNameWrapper={styles.balance}
          classNameSecondary={styles.balanceSecondary}
          classNameUnit={styles.balanceUnit}
        />
      }
    />
    <div className={styles.border} />
    <GridItem
      className={styles.openChannels}
      label={
        <T id="ln.overviewTab.accountOverview.openChannels" m="Open Channels" />
      }
      value={channelsCount}
    />
    <GridItem
      className={styles.capacity}
      label={<T id="ln.overviewTab.accountOverview.capacity" m="Capacity" />}
      value={
        <Balance
          flat
          noSmallAmount
          amount={channelsCapacity}
          classNameWrapper={styles.balance}
          classNameSecondary={styles.balanceSecondary}
          classNameUnit={styles.balanceUnit}
        />
      }
    />
  </div>
);

export default AccountOverview;
