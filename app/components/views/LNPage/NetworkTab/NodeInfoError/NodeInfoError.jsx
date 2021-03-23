import { FormattedMessage as T } from "react-intl";
import styles from "./NodeInfoError.module.css";

const NodeInfoError = ({ error }) => (
  <div className={styles.decodingError}>
    {("" + error).indexOf("unable to find node") > -1 ? (
      <T id="ln.networkTab.queryNode.errNotFound" m="Node not found" />
    ) : (
      "" + error
    )}
  </div>
);

export default NodeInfoError;
