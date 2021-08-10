import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "./BalancesHeader.module.css";
import { useBalancesHeader } from "./hooks";

const BalancesHeader = () => {
  const { channelBalances } = useBalancesHeader();
  return (
    <div className={styles.balances}>
      <T
        id="ln.header.balances"
        m="You can Send total {maxOutboundAmount} and Receive total {maxInboundAmount}"
        values={{
          maxOutboundAmount: (
            <Balance
              flat
              amount={channelBalances.maxOutboundAmount}
              classNameWrapper={styles.balanceAmount}
            />
          ),
          maxInboundAmount: (
            <Balance
              flat
              amount={channelBalances.maxInboundAmount}
              classNameWrapper={styles.balanceAmount}
            />
          )
        }}
      />
    </div>
  );
};

export default BalancesHeader;
