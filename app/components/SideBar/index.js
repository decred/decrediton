import Bar from "./Bar";
import { rescan, sideBar } from "connectors";
import { useSideBar } from "./hooks";

function SideBar(props) {
  const { isShowingAccounts, onShowAccounts, onHideAccounts } = useSideBar();

  return (
    <Bar
      {...{
        ...props,
        isShowingAccounts,
        onShowAccounts,
        onHideAccounts,
      }}
    />
  );
}

export default sideBar(rescan(SideBar));
