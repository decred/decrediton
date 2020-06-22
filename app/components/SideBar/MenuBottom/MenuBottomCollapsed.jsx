import { RescanButton, RescanCancelButton } from "buttons";
import style from "./MenuBottom.module.css";

const MenuBottomColllapsed = ({
  rescanRequest,
  rescanAttempt,
  rescanCancel
}) => (
    <div className={style.sidebarMenuBottomLatestBlock}>
      <div className={style.rescanAreaButton}>
        <RescanButton {...{ rescanRequest, rescanAttempt }} />
        {rescanRequest && (
          <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
        )}
      </div>
    </div>
  );

export default MenuBottomColllapsed;
