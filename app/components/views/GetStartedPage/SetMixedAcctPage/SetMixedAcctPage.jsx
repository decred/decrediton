import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import { useDaemonStartup, useMountEffect, useAccounts } from "hooks";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { KeyBlueButton } from "buttons";
import styles from "./SetMixedAcctPage.module.css";
import { classNames } from "pi-ui";
import { useEffect } from "react";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";

export default ({ cancel, onSendContinue }) => {
  const { getCoinjoinOutputspByAcct, setCoinjoinCfg } = useDaemonStartup();
  const { onRenameAccount } = useAccounts();
  const [coinjoinSumByAcct, setCjSumByAcct] = useState(null);
  const [mixedAcctIdx, setMixedAcctIdx] = useState(null);
  const [changeAcctIdx, setChangeAcctIdx] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const onSetMixedAcct = (acctIdx) => {
    // can't set same mixed and change acct
    if (acctIdx === changeAcctIdx) {
      return;
    }
    setMixedAcctIdx(acctIdx);
  };

  const onSubmitSetChange = (acctIdx) => {
    // can't set same mixed and change acct
    if (acctIdx === mixedAcctIdx) {
      return;
    }
    setChangeAcctIdx(acctIdx);
  };

  const onSubmitContinue = () => {
    onRenameAccount(changeAcctIdx, CHANGE_ACCOUNT);
    onRenameAccount(mixedAcctIdx, MIXED_ACCOUNT);
    setCoinjoinCfg(mixedAcctIdx, changeAcctIdx);
    onSendContinue();
  };

  useMountEffect(() => {
    getCoinjoinOutputspByAcct()
      .then((r) => setCjSumByAcct(r))
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    const isValid =
      mixedAcctIdx !== null &&
      changeAcctIdx !== null &&
      mixedAcctIdx !== changeAcctIdx;
    setIsValid(isValid);
  }, [mixedAcctIdx, changeAcctIdx]);

  return (
    <div className={styles.content}>
      <div className={GetStartedStyles.goBackScreenButtonArea}>
        <Tooltip text={<GoBackMsg />}>
          <div
            className={GetStartedStyles.goBackScreenButton}
            onClick={cancel}
          />
        </Tooltip>
      </div>
      <Subtitle
        className={styles.subtitle}
        title={<T id="getstarted.setAccount.title" m="Set Mixed Account" />}
      />
      {coinjoinSumByAcct && (
        <div className={styles.description}>
          <T
            id="getstarted.setAccount.description"
            m={`Looks like you have accounts with coinjoin outputs. Past
                account names cannot be restored during Recovery, so it is not
                possible to know which account was the mixed account. You can
                set a mixed and unmixed account now or this can be done later on
                the privacy page.
                
                With this action the chosen accounts will be renamed.`}
            values={{ acctsNumber: coinjoinSumByAcct.length }}
          />
        </div>
      )}
      {mixedAcctIdx !== null && (
        <div>
          <T
            id="getstarted.setAcct.mixedAcct"
            m="Mixed Account: {value}"
            values={{ value: <span>{mixedAcctIdx}</span> }}
          />
        </div>
      )}
      {changeAcctIdx !== null && (
        <div>
          <T
            id="getstarted.setAcct.changAcct"
            m="Unmixed Account: {value}"
            values={{ value: <span>{changeAcctIdx}</span> }}
          />
        </div>
      )}
      {coinjoinSumByAcct && (
        <>
          <div className={classNames("is-row", styles.cardsWrapper)}>
            {coinjoinSumByAcct.map(({ acctIdx, coinjoinSum }) => (
              <div key={acctIdx} className={classNames("is-row", styles.card)}>
                <div className={classNames("is-column", styles.labelWrapper)}>
                  <div className="is-row">
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
                      values={{
                        coinjoinSum: (
                          <span className={styles.coinjoinSum}>
                            {coinjoinSum}
                          </span>
                        )
                      }}
                    />
                  </div>
                </div>
                {acctIdx !== 0 && (
                  <div className={classNames("is-column", styles.buttons)}>
                    <div className={classNames("is-row", styles.checkboxRow)}>
                      <input
                        id={`mixed${acctIdx}`}
                        name={acctIdx}
                        type="checkbox"
                        checked={mixedAcctIdx === acctIdx}
                        onChange={() => onSetMixedAcct(acctIdx)}
                        value={acctIdx}
                      />
                      <label
                        htmlFor={`mixed${acctIdx}`}
                        className={styles.checkboxLabel}></label>
                      <div className={styles.label}>
                        <T
                          id="getstarted.setAccount.mix"
                          m="Set Mixed Account"
                        />
                      </div>
                    </div>
                    <div className={classNames("is-row", styles.checkboxRow)}>
                      <input
                        id={`change${acctIdx}`}
                        name={`a${acctIdx}`}
                        type="checkbox"
                        checked={changeAcctIdx === acctIdx}
                        onChange={() => onSubmitSetChange(acctIdx)}
                        value={acctIdx}
                      />
                      <label
                        htmlFor={`change${acctIdx}`}
                        className={styles.checkboxLabel}></label>
                      <div className={styles.label}>
                        <T
                          id="getstarted.setAccount.change"
                          m="Set Unmixed Account"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!isValid && (
            <div className="error">
              <T
                id="getstarted.setAccount.isValidMessage"
                m="You need to set a mixed and unimxed account, and they can not
                  be the same"
              />
            </div>
          )}
          <div className={styles.buttonWrapper}>
            <KeyBlueButton onClick={onSubmitContinue} disabled={!isValid}>
              <T id="getstarted.setAccount.continue" m="Continue" />
            </KeyBlueButton>
          </div>
        </>
      )}
    </div>
  );
};
