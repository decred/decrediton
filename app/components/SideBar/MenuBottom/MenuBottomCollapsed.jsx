import { RescanButton, RescanCancelButton } from "buttons";
import style from "./MenuBottom.module.css";
import { classNames } from "pi-ui";

const MenuBottomCollapsed = ({
  rescanRequest,
  rescanAttempt,
  rescanCancel,
  sidebarOnBottom
}) => (
  <>
    {!sidebarOnBottom && (
      <div
        className={classNames(
          style.latestBlock,
          style.latestBlockCollapsed
        )}>
        <div className={style.rescanButtonAreaCollapsed}>
          <RescanButton {...{ rescanRequest, rescanAttempt }} />
          {rescanRequest && (
            <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
          )}
        </div>
      </div>
    )}
  </>
);

export default MenuBottomCollapsed;
