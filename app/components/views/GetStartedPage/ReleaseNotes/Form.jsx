import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { Documentation } from "shared";
import styles from "../GetStarted.module.css";
import { BackButton, BackButtonArea } from "../helpers";

export default ({
  onSendBack,
  version,
  docName,
  imgClassName,
  onNewerVersion,
  onOlderVersion
}) => (
  <>
    <div className={styles.contentTitle}>
      <BackButtonArea>
        <Tooltip content={<T id="releaseNotes.goBack" m="Go back" />}>
          <BackButton onClick={onSendBack} />
        </Tooltip>
      </BackButtonArea>
      <T
        id="getStarted.releaseNotesTitle"
        m="Decrediton v{version} Released"
        values={{ version }}
      />
      <div className={styles.releaseNotesVersionNavigation}>
        <a href="#" onClick={onNewerVersion}>
          <T id="getStarted.releaseNotes.NewerVersion" m="Newer Version" />
        </a>
        <a href="#" onClick={onOlderVersion}>
          <T id="getStarted.releaseNotes.OlderVersion" m="Older Version" />
        </a>
      </div>
    </div>
    <div className={styles.releaseNotes}>
      <Documentation name={docName} className={styles.releaseNotesText} />
      <div
        className={classNames(styles.releaseNotesImage, styles[imgClassName])}
      />
    </div>
  </>
);
