import { useState, useEffect } from "react";
import { classNames, Checkbox } from "pi-ui";
import { Tooltip, Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import { useDaemonStartup, useMountEffect, useAccounts } from "hooks";
import GetStartedStyles from "../GetStarted.module.css";
import styles from "./SetMixedAcctPage.module.css";

export default ({ cancel, onSendContinue }) => {
  const { getCoinjoinOutputspByAcct, setCoinjoinCfg } = useDaemonStartup();
  const { onRenameAccount } = useAccounts();
  const [coinjoinSumByAcct, setCjSumByAcct] = useState(null);
  const [mixedAcctIdx, setMixedAcctIdx] = useState(null);
  const [changeAcctIdx, setChangeAcctIdx] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const onSetMixedAcct = (acctIdx) => {
    // If chosen index already set as change account
    // unset it to null.
    if (acctIdx === changeAcctIdx) {
      setChangeAcctIdx(null);
    }
    setMixedAcctIdx(acctIdx);
  };

  const onSetChangeAcct = (acctIdx) => {
    // If chosen index already set as mixed account
    // unset it to null.
    if (acctIdx === mixedAcctIdx) {
      setMixedAcctIdx(null);
    }
    setChangeAcctIdx(acctIdx);
  };

  const onContinue = () => {
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
                      <Checkbox
                        id={`mixed${acctIdx}`}
                        label={<T id="getstarted.setAccount.mix" m="Set Mixed Account" />}
                        checked={mixedAcctIdx === acctIdx}
                        onChange={() => onSetMixedAcct(acctIdx)}
                      />
                    </div>
                    <div className={classNames("is-row", styles.checkboxRow)}>
                      <Checkbox
                        id={`change${acctIdx}`}
                        label={<T id="getstarted.setAccount.change" m="Set Unmixed Account" />}
                        checked={changeAcctIdx === acctIdx}
                        onChange={() => onSetChangeAcct(acctIdx)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!isValid && (
            <div className="error">
              <T id="getstarted.setAccount.isValidMessage"
                m="You need to set a mixed and unmixed account, and they can not
                  be the same"
              />
            </div>
          )}
          <div className={styles.buttonWrapper}>
            <KeyBlueButton onClick={onContinue} disabled={!isValid}>
              <T id="getstarted.setAccount.continue" m="Continue" />
            </KeyBlueButton>
          </div>
        </>
      )}
    </div>
  );
};
