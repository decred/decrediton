import { compose, eq, get } from "fp";
import { spring } from "react-motion";
import { PurchaseTicketsForm } from "shared";
import PurchaseTicketsAdvanced from "./PurchaseTicketsAdvanced";
import PurchaseTicketsQuickBar from "./PurchaseTicketsQuickBar";
import { isNullOrUndefined } from "util";
import { usePurchaseTickets } from "./hooks";
import { MAX_POSSIBLE_FEE_INPUT } from "constants";

const PurchaseTickets = ({
  toggleShowVsp,
  onChangeAccount: onChangeAccountProp,
  toggleIsLegacy
}) => {
  const {
    ticketPrice,
    configuredStakePools,
    numTicketsToBuy,
    intl,
    dismissBackupRedeemScript,
    isWatchingOnly,
    notMixedAccounts,
    getRunningIndicator,
    ticketFeeError,
    setTicketFeeError,
    txFeeError,
    setTxFeeError,
    expiryError,
    setExpiryError,
    isShowingAdvanced,
    setIsShowingAdvanced,
    setNumTicketsToBuy,
    ticketFee,
    setTicketFee,
    txFee,
    setTxFee,
    conf,
    expiry,
    setExpiry,
    account,
    setAccount,
    stakePool,
    onPurchaseTickets: onPurchaseTicketsProp,
    onChangeStakePool,
    onRevokeTickets,
    onDismissBackupRedeemScript
  } = usePurchaseTickets();

  const getQuickBarComponent = () => {
    return [
      {
        data: (
          <PurchaseTicketsQuickBar
            {...{ stakePool: getStakePool(), ticketFee, txFee, expiry }}
          />
        ),
        key: "output_0",
        style: {
          opacity: spring(1, { stiffness: 120, damping: 17 })
        }
      }
    ];
  };

  const getAdvancedComponent = () => {
    const v = (e) => e.target.value;
    const changeTicketFee = (e) => onChangeTicketFee(v(e));
    const changeTxFee = (e) => onChangeTxFee(v(e));
    const changeExpiry = (e) => onChangeExpiry(v(e));
    return [
      {
        data: (
          <PurchaseTicketsAdvanced
            {...{
              configuredStakePools,
              stakePool: getStakePool(),
              ticketFee,
              txFee,
              expiry,
              ticketFeeError,
              txFeeError,
              expiryError,
              toggleShowVsp,
              onChangeStakePool,
              onChangeTicketFee: changeTicketFee,
              onChangeTxFee: changeTxFee,
              onChangeExpiry: changeExpiry,
              formatMessage: intl.formatMessage
            }}
          />
        ),
        key: "output_1",
        style: {
          opacity: spring(1, { stiffness: 120, damping: 17 })
        }
      }
    ];
  };

  const willEnter = (height) => {
    return {
      height: height,
      opacity: 0
    };
  };

  const willLeave = () => {
    return {
      height: 0,
      opacity: 0
    };
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode == 38) {
      e.preventDefault();
      onIncrementNumTickets();
    } else if (e.keyCode == 40) {
      e.preventDefault();
      onDecrementNumTickets();
    }
  };

  const getStakePool = () => {
    return stakePool
      ? configuredStakePools.find(compose(eq(stakePool.Host), get("Host")))
      : null;
  };

  const getCanAffordTickets = () => {
    return account && account.spendable > ticketPrice * numTicketsToBuy;
  };

  const onHideAdvanced = () => {
    setIsShowingAdvanced(false);
  };

  const onShowAdvanced = () => {
    setIsShowingAdvanced(true);
  };

  const onToggleShowAdvanced = () => {
    isShowingAdvanced ? onHideAdvanced() : onShowAdvanced();
  };

  const onChangeAccount = (account) => {
    setAccount(account);
    onChangeAccountProp?.(account);
  };

  const onIncrementNumTickets = () => {
    setNumTicketsToBuy((numTicketsToBuy) =>
      numTicketsToBuy == "" ? 1 : numTicketsToBuy + 1
    );
  };

  const onChangeNumTickets = (numTicketsToBuy) => {
    if (parseInt(numTicketsToBuy)) {
      setNumTicketsToBuy(parseInt(numTicketsToBuy));
    } else if (numTicketsToBuy == "") {
      setNumTicketsToBuy(numTicketsToBuy);
    }
  };

  const onDecrementNumTickets = () => {
    setNumTicketsToBuy((numTicketsToBuy) =>
      numTicketsToBuy <= 1 ? 1 : numTicketsToBuy - 1
    );
  };

  const getIsValid = () => {
    if (!getCanAffordTickets()) return false;
    if (getErrors()) return false;
    return true;
  };

  const onPurchaseTickets = (privpass) => {
    if (!getIsValid() || !privpass) return;
    onPurchaseTicketsProp?.(
      privpass,
      account.value,
      account.spendable,
      conf,
      numTicketsToBuy,
      expiry,
      ticketFee,
      txFee,
      getStakePool().value
    );
  };

  const onChangeTicketFee = (ticketFee) => {
    const ticketFeeError =
      isNaN(ticketFee) || ticketFee <= 0 || ticketFee >= MAX_POSSIBLE_FEE_INPUT;

    setTicketFee(ticketFee.replace(/[^\d.]/g, ""));
    setTicketFeeError(ticketFeeError);
  };

  const onChangeTxFee = (txFee) => {
    const txFeeError =
      isNaN(txFee) || txFee <= 0 || txFee >= MAX_POSSIBLE_FEE_INPUT;
    setTxFee(txFee.replace(/[^\d.]/g, ""));
    setTxFeeError(txFeeError);
  };

  const onChangeExpiry = (expiry) => {
    const expiryError =
      isNaN(expiry) || expiry < 0 || isNullOrUndefined(expiry) || expiry === "";
    setExpiry(expiry.replace(/[^\d.]/g, ""));
    setExpiryError(expiryError);
  };

  const getErrors = () => {
    return ticketFeeError || txFeeError || expiryError || !numTicketsToBuy;
  };

  const vspFee = getStakePool().PoolFees;

  return (
    <PurchaseTicketsForm
      {...{
        isShowingAdvanced,
        getQuickBarComponent,
        getAdvancedComponent,
        vsp: getStakePool(),
        vspFee,
        isValid: getIsValid(),
        handleOnKeyDown,
        numTicketsToBuy,
        onIncrementNumTickets,
        onDecrementNumTickets,
        onChangeNumTickets,
        onChangeAccount,
        onPurchaseTickets,
        onRevokeTickets,
        onToggleShowAdvanced,
        account,
        ticketPrice,
        willEnter,
        willLeave,
        toggleShowVsp,
        dismissBackupRedeemScript,
        onDismissBackupRedeemScript,
        isWatchingOnly,
        notMixedAccounts,
        getRunningIndicator,
        toggleIsLegacy,
        isLegacy: true
      }}
    />
  );
};

export default PurchaseTickets;
