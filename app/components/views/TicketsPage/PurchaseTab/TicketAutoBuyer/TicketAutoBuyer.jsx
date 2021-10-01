import { TicketAutoBuyerForm } from "shared";
import { useTicketAutoBuyer } from "./hooks";

function TicketAutoBuyer() {
  const {
    balanceToMaintain,
    setBalanceToMaintain,
    account,
    setAccount,
    isRunning,
    isGetVSPAttempt,
    isValidationInProgress,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    isValid,
    errorMsg,
    isSettingsModalVisible,
    showSettingsModal,
    hideSettingsModal,
    onValidate,
    onStartAutoBuyer,
    onStopAutoBuyer,
    onSaveAutoBuyerSettings,
    vspHost,
    maxFeePercentage,
    setMaxFeePercentage
  } = useTicketAutoBuyer();

  return (
    <TicketAutoBuyerForm
      {...{
        onStartAutoBuyer,
        onStopAutoBuyer,
        isRunning,
        isGetVSPAttempt,
        isValidationInProgress,
        balanceToMaintain,
        setBalanceToMaintain,
        account,
        setAccount,
        isValid,
        errorMsg,
        onValidate,
        clicked,
        notMixedAccounts,
        getRunningIndicator,
        onSaveAutoBuyerSettings,
        isSettingsModalVisible,
        showSettingsModal,
        hideSettingsModal,
        maxFeePercentage,
        setMaxFeePercentage,
        vspHost
      }}
    />
  );
}

export default TicketAutoBuyer;
