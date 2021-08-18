import styles from "./CopyableText.module.css";
import { CopyableText as PiUiCopyableText, classNames } from "pi-ui";

const CopyableText = (props) => (
  <PiUiCopyableText
    className={classNames(styles.copyableText, props.className)}
    {...props}
  />
);

export default CopyableText;
