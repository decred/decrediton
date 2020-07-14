import { useEffect, useState, useCallback } from "react";
import { usePrevious } from "helpers";
import { useIntl } from "react-intl";

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

  // const previousAccount = usePrevious(account);
  const previousAccountNumDetailsShown = usePrevious(accountNumDetailsShown);

  useEffect(() => {
    if (previousAccountNumDetailsShown === accountNumDetailsShown) {
      return;
    }
    if (account.accountNumber !== accountNumDetailsShown) {
      setIsShowingDetails(false);
    }
    if (accountNumDetailsShown === account.accountNumber) {
      setShowPubKey(false);
    }
  }, [
    account,
    accountNumDetailsShown,
    previousAccountNumDetailsShown
  ]);

  const updateRenameAccountName = useCallback((accountName) => {
    if (accountName == "") {
      setHasFailedAttempt(true);
    }
    setRenameAccountName(accountName);
  }, []);

  const renameAccountCallback = useCallback(() => {
    if (!renameAccountName || renameAccountName == "") {
      setHasFailedAttempt(true);
      return;
    }
    renameAccount(renameAccountNumber, renameAccountName);
    setRenameAccountName(null);
    setIsShowingRenameAccount(false);
  }, [renameAccount, renameAccountName, renameAccountNumber]);

  const showRenameAccount = useCallback(() => {
    setHasFailedAttempt(false);
    setIsShowingRenameAccount(true);
  }, []);

  const hideRenameAccount = useCallback(() => {
    setIsShowingRenameAccount(false);
  }, []);

  const showAccountCallback = useCallback(() => {
    showAccount(account.accountNumber);
    setHidden(false);
  }, [showAccount, account.accountNumber]);

  const hideAccountCallback = useCallback(() => {
    hideAccount(account.accountNumber);
    setHidden(true);
  }, [hideAccount, account.accountNumber]);

  const onTogglePubkey = useCallback(() => {
    onGetAccountExtendedKey(account.accountNumber);
    setShowPubKey(!showPubKey);
  }, [onGetAccountExtendedKey, account.accountNumber, showPubKey]);

  const onToggleShowDetails = useCallback(() => {
    setIsShowingDetails(!isShowingDetails);
  }, [isShowingDetails]);

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
    intl
  };
}
