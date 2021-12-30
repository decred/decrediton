import { BalanceDisplay } from "shared";
import { DescriptionHeader } from "layout";
import { useTreasuryInfo } from "../hooks";
import { FormattedMessage as T } from "react-intl";
import styles from "./TabHeader.module.css";
import { classNames } from "pi-ui";

const TabHeader = ({ descriptionHeaderClassName }) => {
  const { treasuryBalance } = useTreasuryInfo();
  return (
    <>
      <DescriptionHeader
        description={
          <T id="governance.description" m="Governance aspects of Decred." />
        }
        className={classNames(
          styles.descriptionHeader,
          descriptionHeaderClassName
        )}
      />
      {treasuryBalance && (
        <DescriptionHeader
          description={
            <T
              id="governance.treasury_balance"
              m="Available Treasury Balance: {treasuryBalance}"
              values={{
                treasuryBalance: <BalanceDisplay amount={treasuryBalance} />
              }}
            />
          }
          className={classNames(
            styles.descriptionHeader,
            descriptionHeaderClassName
          )}
        />
      )}
    </>
  );
};

export default TabHeader;
