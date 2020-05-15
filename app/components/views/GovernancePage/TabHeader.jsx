import { Balance } from "shared";
import { DescriptionHeader } from "layout";
import { useTreasuryInfo } from "./hooks";
import { FormattedMessage as T } from "react-intl";

const TabHeader = () => {
  const { treasuryBalance } = useTreasuryInfo();
  return (
    <>
      <DescriptionHeader
        description={
          <T id="governance.description" m="Governance aspects of Decred." />
        }
      />
      {treasuryBalance && (
        <DescriptionHeader
          description={
            <T
              id="governance.treasury_balance"
              m="Available Treasury Balance: {treasuryBalance}"
              values={{
                treasuryBalance: (
                  <Balance
                    flat
                    amount={treasuryBalance}
                    classNameWrapper="header-small-balance"
                  />
                )
              }}
            />
          }
        />
      )}
    </>
  );
};

export default TabHeader;
