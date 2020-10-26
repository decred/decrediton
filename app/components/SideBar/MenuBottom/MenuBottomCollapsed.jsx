import { RescanButton, RescanCancelButton } from "buttons";
import style from "./MenuBottom.module.css";
import { classNames } from "pi-ui";

const MenuBottomCollapsed = ({
  rescanRequest,
  rescanAttempt,
  rescanCancel,
  sidebarOnBottom,
  isSPV
}) => (
  <>
    {!sidebarOnBottom && (
      <div
        className={classNames(
          style.latestBlock
        )}>
        <div className={style.rescanButtonAreaCollapsed}>
          <RescanButton {...{ rescanRequest, rescanAttempt }} />
          {rescanRequest && (
            <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
          )}
          {isSPV && <span className={style.spvLabel}>SPV</span>}
        </div>
      </div>
    )}
  </>
);

export default MenuBottomCollapsed;
