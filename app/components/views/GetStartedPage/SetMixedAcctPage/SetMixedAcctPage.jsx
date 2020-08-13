import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import { useDaemonStartup, useMountEffect, useAccounts } from "hooks";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { InvisibleConfirmModalButton, KeyBlueButton } from "buttons";
import styles from "./SetMixedAcctPage.module.css";
import { classNames } from "pi-ui";

export default ({ onSendBack, onSendContinue }) => {
  const { getCoinjoinOutputspByAcct, setCoinjoinCfg } = useDaemonStartup();
  const { onRenameAccount } = useAccounts();
  const [coinjoinSumByAcct, setCjSumByAcct] = useState(null);
  const [mixedAcctIdx, setMixedAcctIdx] = useState(null);
  const [changeAcctIdx, setChangeAcctIdx] = useState(null);
  useMountEffect(() => {
    getCoinjoinOutputspByAcct().then((r) => setCjSumByAcct(r)).catch(err => console.log(err));
  });
  const onSubmitRename = (acctIdx, newName = "mixed") => {
    setMixedAcctIdx(acctIdx);
    onRenameAccount(acctIdx, newName)
  };
  const onSubmitSetChange = (acctIdx) => setChangeAcctIdx(acctIdx);
  const onSubmitContinue = () => {
    setCoinjoinCfg(mixedAcctIdx, changeAcctIdx)
    onSendContinue();
  }

  return (
    <div className={styles.content}>
      <div className={GetStartedStyles.goBackScreenButtonArea}>
        <Tooltip text={<GoBackMsg />}>
          <div className={GetStartedStyles.goBackScreenButton} onClick={onSendBack} />
        </Tooltip>
      </div>
      <Subtitle
        className={styles.subtitle}
        title={<T id="getstarted.setAccount.title" m="Set Mixed Account" />}
      />
      {coinjoinSumByAcct &&
        <div className={styles.description}>
          <T id="getstarted.setAccount.description"
            m={`Looks like you have accounts with
                coinjoin outputs. Past account names cannot be restored during
                Recovery, you can rename them now and set an unmixed account,
                so we can config the mixer.
                
                This can also be done later on privacy page.`}
            values={{ acctsNumber: coinjoinSumByAcct.length }}
          />
        </div>
      }
      {coinjoinSumByAcct &&
        <>
          <div className={classNames("is-row", styles.cardsWrapper)}>
            {coinjoinSumByAcct.map(({ acctIdx, coinjoinSum }) => {
              return (
                <div key={acctIdx} className={classNames("is-row", styles.card)}>
                  <div className={classNames("is-column", styles.labelWrapper)}>
                    <div className={"is-row"}>
                      <div className={styles.accountIcon} />
                      <div className={styles.accountLabel}>
                        <T
                          id="getstarted.setAccount.acctIdxRow"
                          m="Account {acctIdx}"
                          values={{ acctIdx: <span>{acctIdx}</span> }}
                        />
                      </div>
                    </div>
                    <div className={styles.coinjoinLabel}>
                      <T
                        id="getstarted.setAccount.sumCoinjoin"
                        m="Coinjoin Sum outputs: {coinjoinSum}"
                        values={{ coinjoinSum: <span className={styles.coinjoinSum}>{coinjoinSum}</span> }}
                      />
                    </div>
                  </div>
                  <div className={classNames("is-column", styles.buttons)}>
                    <InvisibleConfirmModalButton
                      className={styles.iconButton}
                      modalTitle={
                        <T id="getstarted.setAccount.modalTitle" m="Rename Account" />
                      }
                      buttonLabel={<div className={styles.renameIcon} />}
                      modalContent={
                        <T
                          id="getstarted.setAccount.modalContent"
                          m={"Rename Account {acctIdx} to {mixed} account?"}
                          values={{
                            acctIdx: acctIdx,
                            mixed: <span>mixed</span>
                          }}
                        />
                      }
                      size="large"
                      block={false}
                      onSubmit={() => onSubmitRename(acctIdx)}
                    />
                    <InvisibleConfirmModalButton
                      className={styles.changeAcctBttn}
                      modalTitle={
                        <T id="getstarted.setChangeAccount.modalTitle" m="Set Change Account" />
                      }
                      buttonLabel={<span>Set change Account</span>}
                      modalContent={
                        <T
                          id="getstarted.setChangeAccount.modalContent"
                          m={"Set Account {acctIdx} as your change account?"}
                          values={{ acctIdx: acctIdx }}
                        />
                      }
                      size="large"
                      block={false}
                      onSubmit={() => onSubmitSetChange(acctIdx)}
                    >
                      
                    </InvisibleConfirmModalButton>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.buttonWrapper}>
            <KeyBlueButton onClick={onSubmitContinue}>
              <T id="getstarted.setAccount.continue" m="Continue" />
            </KeyBlueButton>
          </div>
        </>
      }
    </div>
  );
};
