import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { Documentation } from "shared";
import styles from "./Form.module.css";
import { BackButton, BackButtonArea, ContentContainer } from "../../helpers";

const Form = ({
  onSendBack,
  version,
  docName,
  imgClassName,
  onNewerVersion,
  onOlderVersion
}) => (
  <>
    <ContentContainer>
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
      <div className={styles.navigation}>
        <a href="#" onClick={onNewerVersion}>
          <T id="getStarted.releaseNotes.NewerVersion" m="Newer Version" />
        </a>
        <a href="#" onClick={onOlderVersion}>
          <T id="getStarted.releaseNotes.OlderVersion" m="Older Version" />
        </a>
      </div>
    </ContentContainer>
    <div className={styles.releaseNotes}>
      <Documentation name={docName} className={styles.text} />
      <div className={classNames(styles.image, styles[imgClassName])} />
    </div>
  </>
);

export default Form;
