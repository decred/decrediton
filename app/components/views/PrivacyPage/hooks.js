import { useSelector } from "react-redux";
import * as sel from "selectors";

export function usePrivacyPage() {
  const privacyEnabled = useSelector(sel.getPrivacyEnabled);
  const isCreateAccountDisabled = useSelector(sel.isWatchingOnly);
  const mixedAccountName = useSelector(sel.getMixedAccountName);
  const changeAccountName = useSelector(sel.getChangeAccountName);

  return {
    privacyEnabled,
    isCreateAccountDisabled,
    mixedAccountName,
    changeAccountName
  };
}
