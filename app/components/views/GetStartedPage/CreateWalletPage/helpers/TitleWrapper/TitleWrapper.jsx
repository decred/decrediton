import { classNames } from "pi-ui";
import { Title } from "../../../helpers";
import styles from "./TitleWrapper.module.css";

const TitleWrapper = ({ children, title }) => (
  <div className={classNames(styles.titleWrapper, "flex-row")}>
    <Title>{title}</Title>
    {children}
  </div>
);

export default TitleWrapper;
