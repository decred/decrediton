import { compose, eq, get } from "fp";
import TicketAutoBuyerForm from "./Form";
import { useTicketAutoBuyer } from "./hooks";

const TicketAutoBuyer = () => {
  const {
    configuredStakePools,
    intl,
    notMixedAccounts,
    getRunningIndicator,
    clicked,
    setClicked,
    balanceToMaintainError,
    stakePool,
    setStakePool,
    account,
    setAccount,
    balanceToMaintain,
    setBalanceToMaintain,
    isTicketAutoBuyerEnabled,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer
  } = useTicketAutoBuyer();

  const getStakePool = () => {
    return stakePool
      ? configuredStakePools.find(compose(eq(stakePool.Host), get("Host")))
      : null;
  };

  const onClick = () => {
    setClicked(true);
  };

  const onStartAutoBuyer = (passphrase) => {
    onEnableTicketAutoBuyer?.(
      passphrase,
      account,
      balanceToMaintain,
      getStakePool()
    );
  };

  const getIsFormValid = () => {
    return account && balanceToMaintain >= 0 && getStakePool();
  };

  return (
    <TicketAutoBuyerForm
      {...{
        formatMessage: intl.formatMessage,
        isFormValid: !!getIsFormValid(),
        account,
        setAccount,
        stakePool: getStakePool(),
        setStakePool,
        clicked,
        onClick,
        onStartAutoBuyer,
        onDisableTicketAutoBuyer,
        isTicketAutoBuyerEnabled,
        balanceToMaintain,
        setBalanceToMaintain,
        balanceToMaintainError,
        configuredStakePools,
        notMixedAccounts,
        getRunningIndicator
      }}
    />
  );
};

export default TicketAutoBuyer;
