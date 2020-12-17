import { useEffect, useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import { Subtitle } from "shared";
import { StandalonePage, StandaloneHeader } from "layout";
import { AccountsSelect } from "inputs";
import { Balance } from "shared";
import { useListUtxo } from "./hooks";
import styles from "./ListUtxo.module.css";

const Header = () => (
  <StandaloneHeader
    iconClassName="transactions"
    title={<T id="transactions.title" m="List Utxo" />}
  />
);

export default () => {
  const { onListUnspentOutputs } = useListUtxo();
  const [unspentOutputs, setUnspentOutputs] = useState(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    if (!account) {
      return;
    }
    onListUnspentOutputs(account.value)
      .then(outputs => setUnspentOutputs(outputs));
    }, [onListUnspentOutputs, account]
  );

  return (
    <StandalonePage header={<Header />}>
      <Subtitle title={<T id="listutxo.title" m="List Unspent Utxo" />} />
      <AccountsSelect
        className="stakepool-purchase-ticket-input-select"
        {...{ account, onChange: setAccount }}
      />
      <div>
      <div className={styles.tableHeader}>
        <div>
          <T id="vsptickets.table.header.status" m="utxo" />
        </div>
        <div>
          <T id="vsptickets.table.header.price" m="value" />
        </div>
      </div>
      {unspentOutputs && (
        unspentOutputs.map((utxo, index) => (
          <div key={index} className={classNames("is-row", styles.utxoTable)}>
            <div className>
              {utxo.txHash}:{utxo.outpointIndex}
            </div>
            <Balance amount={utxo.amount} />
          </div>
        ))
      )}
      </div>
    </StandalonePage>
  );
};
