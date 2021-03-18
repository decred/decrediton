import StandalonePageBody from "../StandalonePageBody";
import { classNames } from "pi-ui";
import styles from "./StandalonePage.module.css";

const StandalonePage = ({ header, children, className }) => {
  const body = header ? (
    <StandalonePageBody>{children}</StandalonePageBody>
  ) : (
    children
  );

  return (
    <div className={classNames(styles.page, className)}>
      {header}
      {body}
    </div>
  );
};

export default StandalonePage;
