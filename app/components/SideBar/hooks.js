import { useState, useCallback } from "react";

export function useSideBar() {
  const [isShowingAccounts, setIsShowingAccounts] = useState(false);

  const onShowAccounts = useCallback(() => {
    setIsShowingAccounts(true);
  }, [setIsShowingAccounts]);

  const onHideAccounts = useCallback(() => {
    setIsShowingAccounts(false);
  }, [setIsShowingAccounts]);

  return { isShowingAccounts, onShowAccounts, onHideAccounts };
}
