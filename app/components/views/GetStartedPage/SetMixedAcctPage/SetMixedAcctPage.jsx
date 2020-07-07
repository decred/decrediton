import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import { useDaemonStartup, useMountEffect, useAccounts } from "hooks";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { ConfirmModalKeyBlueBtn } from "buttons";
import styles from "./SetMixedAcctPage.module.css";
import { classNames } from "pi-ui";

export default ({ onSendBack }) => {
  const { getCoinjoinOutputspByAcct } = useDaemonStartup();
  const { onRenameAccount } = useAccounts();
  const [coinjoinSumByAcct, setCjSumByAcct] = useState(null);
  useMountEffect(() => {
    getCoinjoinOutputspByAcct().then((r) => setCjSumByAcct(r));
  });
  const onSubmit = (acctIdx, newName="mixed") => onRenameAccount(acctIdx, newName);

  return (
    <>
      <div className={GetStartedStyles.goBackScreenButtonArea}>
        <Tooltip text={<GoBackMsg />}>
          <div className={GetStartedStyles.goBackScreenButton} onClick={onSendBack} />
        </Tooltip>
      </div>
      <Subtitle
        title={<T id="getstarted.setAccount.title" m="Set Mixed Account" />}
      />
      <div className={GetStartedStyles.logContainer}>
        {coinjoinSumByAcct && (
          <div >
            <div className={styles.title}>
              {`Looks like you have ${coinjoinSumByAcct.length} accounts with coinjoin outputs`}
            </div>
            <div className={"is-row"}>
              {coinjoinSumByAcct.map(({ acctIdx, coinjoinSum }) => {
                return (
                  <div className={classNames(styles.rowWrapper, "is-column")}>
                    <div className={styles.acctRow} onClick={onRenameAccount}>
                      <div className={styles.rowLabel}>
                        <T
                          id="getstarted.setAccount.acctIdxRow"
                          m="Account Index: {acctIdx}"
                          values={{ acctIdx: <span>{acctIdx}</span> }}
                        />
                      </div>
                      <div className={styles.rowLabel}>
                        <T
                          id="getstarted.setAccount.sumCoinjoin"
                          m="Coinjoin Sum outputs: {coinjoinSum}"
                          values={{ coinjoinSum: <span>{coinjoinSum}</span> }}
                        />
                      </div>
                    </div>
                    <ConfirmModalKeyBlueBtn
                      className={styles.blueButton}
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
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
