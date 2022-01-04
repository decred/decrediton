import { BalanceDisplay } from "shared";
import { DescriptionHeader } from "layout";
import { useTreasuryInfo } from "../hooks";
import { FormattedMessage as T } from "react-intl";

const TabHeader = ({ descriptionHeaderClassName }) => {
  const { treasuryBalance } = useTreasuryInfo();
  return (
    <>
      <DescriptionHeader
        description={
          <T id="governance.description" m="Governance aspects of Decred." />
        }
        className={descriptionHeaderClassName}
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
          className={descriptionHeaderClassName}
        />
      )}
    </>
  );
};

export default TabHeader;
