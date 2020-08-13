import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import { useDaemonStartup, useMountEffect, useAccounts } from "hooks";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { InvisibleConfirmModalButton, KeyBlueButton } from "buttons";
import styles from "./SetMixedAcctPage.module.css";
import { classNames } from "pi-ui";
import { useEffect } from "react";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";

export default ({ onSendBack, onSendContinue }) => {
  const { getCoinjoinOutputspByAcct, setCoinjoinCfg } = useDaemonStartup();
  const { onRenameAccount } = useAccounts();
  const [coinjoinSumByAcct, setCjSumByAcct] = useState(null);
  const [mixedAcctIdx, setMixedAcctIdx] = useState(null);
  const [changeAcctIdx, setChangeAcctIdx] = useState(null);
  const [isValid, setIsValid] = useState(false);
  useMountEffect(() => {
    getCoinjoinOutputspByAcct().then((r) => setCjSumByAcct(r)).catch(err => console.log(err));
  });
  const onSubmitRename = (acctIdx) => {
    setMixedAcctIdx(acctIdx);
  };
  const onSubmitSetChange = (acctIdx) => {
    setChangeAcctIdx(acctIdx);
  }
  const onSubmitContinue = () => {
    onRenameAccount(changeAcctIdx, CHANGE_ACCOUNT);
    onRenameAccount(mixedAcctIdx, MIXED_ACCOUNT)
    setCoinjoinCfg(mixedAcctIdx, changeAcctIdx)
    onSendContinue();
  }
  useEffect(() => {
    const isValid = mixedAcctIdx !== null &&
      changeAcctIdx !== null &&
      mixedAcctIdx !== changeAcctIdx;
    setIsValid(isValid)
  }, [mixedAcctIdx && changeAcctIdx]);

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
            m={ `Looks like you have accounts with coinjoin outputs. Past
                account names cannot be restored during Recovery, so it is not
                possible to know which account was the mix account. You can
                set a mix and unmix account now or this can be done later on
                the privacy page.
                
                With this action the chosen accounts will be renamed.`
              }
            values={{ acctsNumber: coinjoinSumByAcct.length }}
          />
        </div>
      }
      {
        mixedAcctIdx !== null &&
        <div>
          <T id="getstarted.setAcct.mixedAcct"
            m="Mixed Acct: {value}"
            values = {{ value: <span>{mixedAcctIdx}</span> }} />
        </div>
      }
      {
        changeAcctIdx !== null &&
        <div>
          <T id="getstarted.setAcct.changAcct"
            m="Change Acct: {value}"
            values = {{ value: <span>{changeAcctIdx}</span> }} />
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
                          m={"Set Account {acctIdx} as your {mixed} account?"}
                          values={{
                            acctIdx: acctIdx,
                            mixed: <span>{MIXED_ACCOUNT}</span>
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
                          m={"Set Account {acctIdx} as your {change} account?"}
                          values={{
                            acctIdx: acctIdx,
                            change: <span>{CHANGE_ACCOUNT}</span>
                          }}
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
          { !isValid &&
            <div className="error">
              <T id="getstarted.setAccount.isValidMessage"
                m="You need to set a mixed and change account and they can not
                  be  the same"
              />
            </div>
          }
          <div className={styles.buttonWrapper}>
            <KeyBlueButton
              onClick={onSubmitContinue}
              disabled={!isValid}
            >
              <T id="getstarted.setAccount.continue" m="Continue" />
            </KeyBlueButton>
          </div>
        </>
      }
    </div>
  );
};
