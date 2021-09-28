import { TicketAutoBuyerForm } from "shared";
import { useTicketAutoBuyer } from "./hooks";
import { LEGACY_StakePoolSelect } from "inputs";

const TicketAutoBuyer = () => {
  const {
    configuredVsps,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    vsp,
    setVsp,
    account,
    setAccount,
    balanceToMaintain,
    setBalanceToMaintain,
    isValid,
    isRunning,
    onValidate,
    onStartAutoBuyer,
    onStopAutoBuyer,
    onSaveAutoBuyerSettings,
    isSettingsModalVisible,
    showSettingsModal,
    hideSettingsModal,
    vspHost
  } = useTicketAutoBuyer();

  const VSPSelectControl = (
    <LEGACY_StakePoolSelect
      options={configuredVsps}
      disabled={isRunning}
      value={vsp}
      onChange={setVsp}
    />
  );

  return (
    <TicketAutoBuyerForm
      {...{
        isValid,
        account,
        setAccount,
        vsp,
        setVsp,
        clicked,
        onValidate,
        onStartAutoBuyer,
        onStopAutoBuyer,
        isRunning,
        balanceToMaintain,
        setBalanceToMaintain,
        configuredVsps,
        notMixedAccounts,
        getRunningIndicator,
        onSaveAutoBuyerSettings,
        isSettingsModalVisible,
        showSettingsModal,
        hideSettingsModal,
        VSPSelectControl,
        vspHost
      }}
    />
  );
};

export default TicketAutoBuyer;
