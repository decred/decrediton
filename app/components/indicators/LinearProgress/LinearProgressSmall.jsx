import "style/Loading.less";
import style from "./LinearProgress.module.css";
import { classNames } from "pi-ui";

const LinearProgressSmall = ({ value, min, max }) => (
  <div
    className={classNames(style.linearProgress, style.small)}
    data-testid="linear-prgress-small">
    <div
      className={style.linearProgressBar}
      style={{ width: `${((value - min) / (max - min)) * 100}%` }}></div>
  </div>
);

export default LinearProgressSmall;
