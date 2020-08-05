import { injectIntl } from "react-intl";
import TicketAutoBuyerForm from "./Form";
import { useState } from "react";
import { usePurchaseTab } from "../hooks";

function TicketAutoBuyer({ intl }) {
  const {
    availableVSPs,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer,
    ticketAutoBuyerRunning
  } = usePurchaseTab();
  const [balanceToMaintain, setBalanceToMaintain] = useState(0);
  const [account, setAccount] = useState(null);
  const [vsp, setVSP] = useState(null);

  const onHandleBalanceToMantain = (e) => setBalanceToMaintain(e.atomValue);

  const onStartAutoBuyer = (passphrase) => {
    onEnableTicketAutoBuyer(passphrase, account, balanceToMaintain, vsp);
  };

  const onStopAutoBuyer = () => onDisableTicketAutoBuyer();

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

