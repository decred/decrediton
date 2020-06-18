import Bar from "./Bar";
import { useSideBar } from "./hooks";

function SideBar() {
  const { isShowingAccounts, onShowAccounts, onHideAccounts } = useSideBar();

  return (
    <Bar
      {...{
        isShowingAccounts,
        onShowAccounts,
        onHideAccounts
      }}
    />
  );
}

export default SideBar;
