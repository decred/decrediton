import { useEffect, useState, useCallback } from "react";
import { usePrevious } from "helpers";

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

  const previousAccount = usePrevious(account);
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
    setRenameAccountName(null)
    setIsShowingRenameAccount(false);
  }, [renameAccountName, renameAccountNumber]);

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
  }, []);

  const hideAccountCallback = useCallback(() => {
    hideAccount(account.accountNumber);
    setHidden(true);
  }, []);

  const onTogglePubkey = useCallback(() => {
    onGetAccountExtendedKey(account.accountNumber);
    setShowPubKey(!showPubKey);
  }, [showPubKey]);

  const onToggleShowDetails = useCallback(() => {
    setIsShowingDetails(!isShowingDetails);
  }, [isShowingDetails]);

  return {
    isShowingRenameAccount,
    renameAccountName,
    renameAccountNumber,
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
    onToggleShowDetails
  };
}
