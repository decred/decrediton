import { FormattedMessage as T } from "react-intl";
import { useShutdown } from "./hooks";
import { useMountEffect } from "hooks";
import { PageBody } from "layout";
import { DecredLoading } from "indicators";
import styles from "./ShutdownPage.module.css";

const ShutdownPage = () => {
  const { cleanShutdown } = useShutdown();
  useMountEffect(() => {
    cleanShutdown();
  });

  return (
    <PageBody getStarted>
      <DecredLoading />
      <div className={styles.shutdownText}>
        <T id="shutdown.header.title" m="Shutting down Decrediton" />
      </div>
    </PageBody>
  );
};

export default ShutdownPage;
