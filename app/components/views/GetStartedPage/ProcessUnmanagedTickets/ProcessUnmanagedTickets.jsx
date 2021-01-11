import { Tooltip, Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import { FormattedMessage as T } from "react-intl";
import GetStartedStyles from "../GetStarted.module.css";
import { useState } from "react";
import { PassphraseModalButton } from "buttons";
import styles from "./ProcessUnmanagedTickets.module.css";
import { useEffect } from "react";
import { VSPSelect } from "inputs";
import { useSelector } from "react-redux";
import * as sel from "selectors";

export default ({ cancel, onSendContinue, onProcessUnmanagedTickets }) => {
  const [isValid, setIsValid] = useState(false);
  const [vsp, setVSP] = useState(null);
  const onSubmitContinue = async (passphrase) => {
    await onProcessUnmanagedTickets(passphrase, vsp.host, vsp.pubkey);
    onSendContinue();
  };

  useEffect(() => {
    if(vsp) {
      setIsValid(true);
    }
  }, [vsp]);

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
        title={<T id="getstarted.setAccount.title" m="Process Unmanaged Tickets" />}
      />
      <div className={styles.description}>
        <T
          id="getstarted.processTickets.description"
          m={`Looks like you have vsp ticket with unprocessed fee. If they are picked
              to vote and they are not linked with a vsp, they may miss, if you are not
              properly dealing with solo vote.`}
        />
      </div>
      <VSPSelect
        className={styles.vspSelect}
        {...{ onChange: setVSP }}
      />
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={
            <T id="tickets.revokeConfirmations.legacy" m="Passphrase" />
          }
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="purchaseTickets.revokeBtn.legacy" m="Continue" />}
          disabled={!isValid}>

        </PassphraseModalButton>
      </div>
    </div>
  );
};
