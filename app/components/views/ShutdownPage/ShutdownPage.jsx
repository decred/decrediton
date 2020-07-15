import { FormattedMessage as T } from "react-intl";
import { useShutdown } from "./hooks";
import { useMountEffect } from "hooks";
import { DecredLoading } from "indicators";
import { classNames } from "pi-ui";
import styles from "../GetStartedPage/GetStarted.module.css";

const ShutdownPage = () => {
  const { cleanShutdown } = useShutdown();
  useMountEffect(cleanShutdown);

  return (
    <div className={classNames(styles.pageBody, styles.getstarted)}>
      <DecredLoading />
      <div className={styles.shutdownText}>
        <T id="shutdown.header.title" m="Shutting down Decrediton" />
      </div>
    </div>
  );
};

export default ShutdownPage;
