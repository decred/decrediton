import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import { useDaemonStartup, useMountEffect, useAccounts } from "hooks";
import styles from "../GetStarted.module.css";
import { useState } from "react";
import { ResetNetworkButton } from "buttons";

export default ({ onSendBack }) => {
  const { getCoinjoinOutputspByAcct } = useDaemonStartup();
  const { onRenameAccount } = useAccounts();
  const [coinjoinSumByAcct, setCjSumByAcct] = useState(null);
  useMountEffect(() => {
    getCoinjoinOutputspByAcct().then((r) => setCjSumByAcct(r));
  });
  const onSubmit = (passphrase) => {
    dispatch(
      amc.createNeededAccounts(passphrase, mixedAccountName, changeAccountName)
    );
  };

  return (
    <>
      <div className={styles.goBackScreenButtonArea}>
        <Tooltip text={<GoBackMsg />}>
          <div className={styles.goBackScreenButton} onClick={onSendBack} />
        </Tooltip>
      </div>
      <Subtitle
        title={<T id="getstarted.setAccount.title" m="Set Mixed Account" />}
      />
      <div className={styles.logContainer}>
        {coinjoinSumByAcct && (
          <div>
            <div>
              {`Looks like you have ${coinjoinSumByAcct.length} accounts with coinjoin outputs`}
            </div>
            <div>
              {coinjoinSumByAcct.map(({ acctIdx, coinjoinSum }) => {
                return (
                  <>
                    <div onClick={onRenameAccount}>
                      <T
                        id="getstarted.setAccount.acctIdxRow"
                        m="Account Index: {acctIdx}"
                        values={{ acctIdx: <span>{acctIdx}</span> }}
                      />
                      <T
                        id="getstarted.setAccount.sumCoinjoin"
                        m="Coinjoin Sum outputs: {coinjoinSum}"
                        values={{ coinjoinSum: <span>{coinjoinSum}</span> }}
                      />
                    </div>
                    <ResetNetworkButton
                      modalTitle={
                        <T id="settings.resetNetworkTitle" m="Rename Account" />
                      }
                      buttonLabel={<T id="settings.save" m="Rename" />}
                      modalContent={
                        <T
                          id="settings.resetNetworkContent"
                          m={"Rename Account {acctIdx} to {mixed} account?"}
                          values = {{ 
                            acctIdx: acctIdx,
                            mixed: <span>mixed</span>
                          }}
                        />
                      }
                      size="large"
                      block={false}
                      onSubmit={onSubmit}
                    />
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
