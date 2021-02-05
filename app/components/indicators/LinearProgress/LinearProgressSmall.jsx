import "style/Loading.less";
import style from "./LinearProgress.module.css";
import { classNames } from "pi-ui";

const LinearProgressSmall = ({ value, min, max, className, barClassName }) => (
  <div
    className={classNames(style.linearProgress, style.small, className && className)}
    data-testid="linear-prgress-small">
    <div
      className={classNames(style.linearProgressBar, barClassName && barClassName)}
      style={{ width: `${((value - min) / (max - min)) * 100}%` }}></div>
  </div>
);

export default LinearProgressSmall;
