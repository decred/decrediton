import { substruct, compose, eq, get } from "fp";
import { injectIntl } from "react-intl";
import TicketAutoBuyerForm from "./Form";
import { DCR, UNIT_DIVISOR } from "constants";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMountEffect } from "hooks";
import { usePurchaseTab } from "../hooks";

function TicketAutoBuyer({ intl }) {
  const { availableVSPs, onEnableTicketAutoBuyer, onDisableTicketAutoBuyer, getTicketStatus, ticketAutoBuyerRunning } = usePurchaseTab();
  const [balanceToMaintain, setBalanceToMaintain] = useState(0);
  const [account, setAccount] = useState(null);
  const [vsp, setVSP] = useState(null);

  const onHandleBalanceToMantain = (e) => {
    const { value, atomValue } = e;
    setBalanceToMaintain(atomValue)
  }

  const onStartAutoBuyer = (passphrase) => {
    onEnableTicketAutoBuyer(passphrase, account, balanceToMaintain, vsp);
  }

  const onStopAutoBuyer = () => {
    onDisableTicketAutoBuyer();
  }

  // TODO remove this - using to test
  // useEffect(() => {
  //   if(!vsp) return;
  //   getTicketStatus(vsp, "4018343932ae082d7534d405d806242eb6658dde755ffb03a226b92b9de21fec").then(r => console.log(r)).catch(err => console.log(err))
  // }, [vsp])


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
        isRunning: ticketAutoBuyerRunning
      }}
    />
  );
}

export default injectIntl(TicketAutoBuyer);

