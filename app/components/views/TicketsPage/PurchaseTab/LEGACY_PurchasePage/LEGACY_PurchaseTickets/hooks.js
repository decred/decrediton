import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as spa from "actions/VSPActions";
import { useIntl } from "react-intl";
import { MIN_RELAY_FEE } from "constants";

export const usePurchaseTickets = () => {
  const ticketPrice = useSelector(sel.ticketPrice);
  const configuredStakePools = useSelector(sel.configuredStakePools);
  const numTicketsToBuyValue = useSelector(sel.numTicketsToBuy);
  const defaultSpendingAccount = useSelector(sel.defaultSpendingAccount);
  const stakePoolValue = useSelector(sel.selectedStakePool);
  const intl = useIntl();
  const dismissBackupRedeemScript = useSelector(sel.dismissBackupRedeemScript);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  const notMixedAccounts = useSelector(sel.getNotMixedAccounts);
  const getRunningIndicator = useSelector(sel.getRunningIndicator);

  const [ticketFeeError, setTicketFeeError] = useState(false);
  const [txFeeError, setTxFeeError] = useState(false);
  const [expiryError, setExpiryError] = useState(false);
  const [isShowingAdvanced, setIsShowingAdvanced] = useState(false);
  const [numTicketsToBuy, setNumTicketsToBuy] = useState(numTicketsToBuyValue);
  const [ticketFee, setTicketFee] = useState(MIN_RELAY_FEE);
  const [txFee, setTxFee] = useState(MIN_RELAY_FEE);
  const [conf] = useState(0);
  const [expiry, setExpiry] = useState(16);
  const [account, setAccount] = useState(defaultSpendingAccount);
  const [stakePool] = useState(stakePoolValue);

  // legacy ticket auto buyer selectors
  const dispatch = useDispatch();

  const onPurchaseTickets = (
    passphrase,
    accountNum,
    spendLimit,
    requiredConf,
    numTickets,
    expiry,
    ticketFee,
    txFee,
    stakepool
  ) =>
    dispatch(
      ca.purchaseTicketsAttempt(
        passphrase,
        accountNum,
        spendLimit,
        requiredConf,
        numTickets,
        expiry,
        ticketFee,
        txFee,
        stakepool
      )
    );
  const onChangeStakePool = (selectedStakePool) =>
    dispatch(spa.changeSelectedStakePool(selectedStakePool));
  const onRevokeTickets = (passphrase) =>
    dispatch(ca.revokeTicketsAttempt(passphrase));
  const onDismissBackupRedeemScript = () =>
    dispatch(spa.dismissBackupRedeemScript());

  return {
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
    onPurchaseTickets,
    onChangeStakePool,
    onRevokeTickets,
    onDismissBackupRedeemScript
  };
};
