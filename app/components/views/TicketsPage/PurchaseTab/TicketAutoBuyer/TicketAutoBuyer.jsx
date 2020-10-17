import { injectIntl } from "react-intl";
import TicketAutoBuyerForm from "./Form";
import { useState, useEffect } from "react";
import { usePurchaseTab } from "../hooks";

function TicketAutoBuyer({ intl }) {
  const {
    availableVSPs,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer,
    ticketAutoBuyerRunning,
    buyerAccount,
    buyerBalanceToMantain,
    buyerVSP
  } = usePurchaseTab();
  const [balanceToMaintain, setBalanceToMaintain] = useState(buyerBalanceToMantain);
  const [account, setAccount] = useState(buyerAccount);
  const [vsp, setVSP] = useState(buyerVSP);
  // we use this bool flag so the error does not show before trying.
  const [clicked, setClicked] = useState(false);
  // isValid check if we can show the modal to start the auto buyer.
  const [isValid, setIsValid] = useState(null);

  const onHandleBalanceToMantain = (e) => setBalanceToMaintain(e.atomValue);

  const onStartAutoBuyer = (passphrase) => {
    onEnableTicketAutoBuyer(passphrase, account, balanceToMaintain, vsp);
  };

  const checkIsValid = (vsp, balanceToMaintain, account) => {
    let isValid = true;
    if (vsp) {
      if (!vsp.pubkey || !vsp.host) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    // balance to mantain can be 0.
    return isValid && ((!!balanceToMaintain || balanceToMaintain === 0) && !!account);
  };

  const onClick = () => {
    setClicked(true);
    setIsValid(checkIsValid(vsp, balanceToMaintain, account));
  };

  const onStopAutoBuyer = () => onDisableTicketAutoBuyer();

  useEffect(
    // we pass those values as parameter, so we don't need to add checkIsValid
    // into the dependecy array.
    () => {
      setIsValid(checkIsValid(vsp, balanceToMaintain, account));
    },
    [vsp, balanceToMaintain, account]
  );

  return (
    <TicketAutoBuyerForm
      {...{
        formatMessage: intl.formatMessage,
        onChangeBalanceToMaintain: onHandleBalanceToMantain,
        changeAccount: setAccount,
        changeVSP: setVSP,
        account,
        vsp,
        onStartAutoBuyer,
        availableVSPs,
        balanceToMaintain,
        onStopAutoBuyer,
        isRunning: ticketAutoBuyerRunning,
        isValid,
        onClick,
        clicked
      }}
    />
  );
}

export default injectIntl(TicketAutoBuyer);

