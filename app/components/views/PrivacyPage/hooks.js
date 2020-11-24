import { useSelector } from "react-redux";
import * as sel from "selectors";

export function usePrivacyPage() {
  const privacyEnabled = useSelector(sel.getPrivacyEnabled);
  const isCreateAccountDisabled = useSelector(sel.isWatchingOnly);

  return {
    privacyEnabled,
    isCreateAccountDisabled
  };
}
