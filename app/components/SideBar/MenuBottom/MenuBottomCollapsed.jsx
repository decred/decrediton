import { RescanButton, RescanCancelButton } from "buttons";
import style from "./MenuBottom.module.css";
import { classNames } from "pi-ui";

const MenuBottomColllapsed = ({
  rescanRequest,
  rescanAttempt,
  rescanCancel,
  sidebarOnBottom
}) => (
  <div
    className={classNames(
      sidebarOnBottom && style.sidebarOnBottom,
      style.sidebarMenuBottomLatestBlock,
      style.sidebarMenuBottomLatestBlockCollapsed
    )}>
    <div className={style.rescanButtonAreaCollapsed}>
      <RescanButton {...{ rescanRequest, rescanAttempt }} />
      {rescanRequest && (
        <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
      )}
    </div>
  </div>
);

export default MenuBottomColllapsed;
