import TicketAutoBuyerForm from "./Form";
import { useTicketAutoBuyer } from "./hooks";

function TicketAutoBuyer() {
  const {
    balanceToMaintain,
    setBalanceToMaintain,
    account,
    setAccount,
    vsp,
    setVsp,
    availableVSPs,
    ticketAutoBuyerRunning,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    isValid,
    isSettingsModalVisible,
    showSettingsModal,
    hideSettingsModal,
    onClick,
    onStartAutoBuyer,
    onStopAutoBuyer,
    onSaveAutoBuyerSettings
  } = useTicketAutoBuyer();

  return (
    <TicketAutoBuyerForm
      {...{
        onStartAutoBuyer,
        onStopAutoBuyer,
        isRunning: ticketAutoBuyerRunning,
        balanceToMaintain,
        setBalanceToMaintain,
        account,
        setAccount,
        vsp,
        setVsp,
        availableVSPs,
        isValid,
        onClick,
        clicked,
        notMixedAccounts,
        getRunningIndicator,
        onSaveAutoBuyerSettings,
        isSettingsModalVisible,
        showSettingsModal,
        hideSettingsModal
      }}
    />
  );
}

export default TicketAutoBuyer;
