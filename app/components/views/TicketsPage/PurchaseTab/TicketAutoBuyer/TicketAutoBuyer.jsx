import { substruct, compose, eq, get } from "fp";
import { injectIntl } from "react-intl";
import TicketAutoBuyerForm from "./Form";
import { DCR, UNIT_DIVISOR } from "constants";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMountEffect } from "hooks";
import { usePurchaseTab } from "../hooks";

function TicketAutoBuyer({ intl }) {
  const {
    availableVSPs,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer,
    getTicketStatus,
    ticketAutoBuyerRunning
  } = usePurchaseTab();
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

  const onStopAutoBuyer = () => onDisableTicketAutoBuyer();

  // TODO remove this - using to test
  useEffect(() => {
    if(!vsp) return;
    getTicketStatus(vsp, "1bb09f6fa90acf8d4be1dfa3a749bcbbb49ed04d9090bd89edeed39379b85a92").then(r => console.log(r)).catch(err => console.log(err))
  }, [vsp])


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

