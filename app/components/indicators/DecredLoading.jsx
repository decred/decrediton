import "style/Loading.less";
import style from "./indicators.module.css";
import { classNames } from "pi-ui";

const DecredLoading = ({ hidden, className }) => (
  <div
    className={classNames(style.decredLoading, className, hidden && style.hidden)}
    data-testid="decred-loading"
  />
);

export default DecredLoading;
