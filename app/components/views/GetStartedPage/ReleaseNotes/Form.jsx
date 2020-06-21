import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import styles from "../GetStarted.module.css";

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
      <div className={styles.goBackScreenButtonArea}>
        <Tooltip text={<T id="releaseNotes.goBack" m="Go back" />}>
          <div className={styles.goBackScreenButton} onClick={onSendBack} />
        </Tooltip>
      </div>
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
      <Documentation name={docName} className="release-notes-text" />
      <div className={["release-notes-image", imgClassName].join(" ")} />
    </div>
  </>
);
