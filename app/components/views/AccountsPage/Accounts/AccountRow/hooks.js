import { useEffect, useState } from "react";
import { usePrevious } from "hooks";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

export function useAccountRow(
  account,
  accountNumDetailsShown,
  renameAccount,
  showAccount,
  hideAccount,
  onGetAccountExtendedKey
) {
  const [isShowingRenameAccount, setIsShowingRenameAccount] = useState(false);
  const [renameAccountName, setRenameAccountName] = useState(null);
  const [renameAccountNumber] = useState(account.accountNumber);
  const [hidden, setHidden] = useState(account.hidden);
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const [showPubKey, setShowPubKey] = useState(false);
  const [isShowingDetails, setIsShowingDetails] = useState(false);

  const intl = useIntl();

  const previousAccountNumber = usePrevious(account.accountNumber);
  const previousAccountNumDetailsShown = usePrevious(accountNumDetailsShown);

  useEffect(() => {
    if (previousAccountNumDetailsShown === accountNumDetailsShown) {
      return;
    }
    if (previousAccountNumber !== accountNumDetailsShown) {
      setIsShowingDetails(false);
    }
    if (previousAccountNumDetailsShown === previousAccountNumber) {
      setShowPubKey(false);
    }
  }, [
    accountNumDetailsShown,
    previousAccountNumber,
    previousAccountNumDetailsShown
  ]);

  const updateRenameAccountName = (accountName) => {
    if (accountName == "") {
      setHasFailedAttempt(true);
    }
    setRenameAccountName(accountName);
  };

  const renameAccountCallback = () => {
    if (!renameAccountName || renameAccountName == "") {
      setHasFailedAttempt(true);
      return;
    }
    renameAccount(renameAccountNumber, renameAccountName);
    setRenameAccountName(null);
    setIsShowingRenameAccount(false);
  };

  const showRenameAccount = () => {
    setHasFailedAttempt(false);
    setIsShowingRenameAccount(true);
  };

  const hideRenameAccount = () => {
    setIsShowingRenameAccount(false);
  };

  const showAccountCallback =() => {
    showAccount(account.accountNumber);
    setHidden(false);
  };

  const hideAccountCallback = () => {
    hideAccount(account.accountNumber);
    setHidden(true);
  };

  const onTogglePubkey = () => {
    onGetAccountExtendedKey(account.accountNumber);
    setShowPubKey(!showPubKey);
  };

  const onToggleShowDetails = () => {
    setIsShowingDetails(!isShowingDetails);
  };

  // TODO move functions which are being imported as props to here.
  const dispatch = useDispatch();
  const onSetAccountPassphrase = (passphrase, args) => {
    const { newPassphrase } = args;
    account.encrypted ?
      dispatch(ca.setAccountPassphrase(account.accountNumber, passphrase, newPassphrase)) :
      dispatch(ca.setAccountPassphrase(account.accountNumber, null, newPassphrase, passphrase));
  };
  const changeAccount = useSelector(sel.getChangeAccount);

  return {
    isShowingRenameAccount,
    renameAccountName,
    hidden,
    hasFailedAttempt,
    showPubKey,
    isShowingDetails,
    updateRenameAccountName,
    renameAccountCallback,
    showRenameAccount,
    hideRenameAccount,
    showAccountCallback,
    hideAccountCallback,
    onTogglePubkey,
    onToggleShowDetails,
    intl,
    onSetAccountPassphrase,
    changeAccount
  };
}
