import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";

export default ({
  onSendBack,
  version,
  docName,
  imgClassName,
  onNewerVersion,
  onOlderVersion
}) => (
  <>
    <div className="content-title">
      <div className="go-back-screen-button-area">
        <Tooltip text={<T id="releaseNotes.goBack" m="Go back" />}>
          <div className="go-back-screen-button" onClick={onSendBack} />
        </Tooltip>
      </div>
      <T
        id="getStarted.releaseNotesTitle"
        m="Decrediton v{version} Released"
        values={{ version }}
      />
      <div className="release-notes-version-navigation">
        <a href="#" onClick={onNewerVersion}>
          <T id="getStarted.releaseNotes.NewerVersion" m="Newer Version" />
        </a>
        <a href="#" onClick={onOlderVersion}>
          <T id="getStarted.releaseNotes.OlderVersion" m="Older Version" />
        </a>
      </div>
    </div>
    <div className="release-notes">
      <Documentation name={docName} className="release-notes-text" />
      <div className={["release-notes-image", imgClassName].join(" ")} />
    </div>
  </>
);
