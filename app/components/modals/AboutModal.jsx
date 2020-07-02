import Modal from "./Modal";
import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";
import style from "./Modals.module.css";

const AboutModal = ({ show, onCancelModal, version, updateAvailable }) => {
  return (
    <Modal className={style.about} {...{ show, onCancelModal }}>
      <div className={style.aboutIcon} />
      <div className={style.aboutContent}>
        <div className={style.aboutTitle}>
          <T id="aboutModal.decrediton" m="Decrediton" />
        </div>
        <div
          className={style.infoCloseButtonTop}
          onClick={onCancelModal}
        />
        <div className={style.aboutTextParagraph}>
          <T
            id="aboutModal.paragraph1"
            m="A cross platform GUI Wallet for Decred written in node.js using Electron"
          />
        </div>
        <div className={style.aboutTextParagraph}>
          <T
            id="aboutModal.paragraph2a"
            m="Decrediton is free and open source software, developed and designed by the global team of"
          />{" "}
          <a
            onClick={() =>
              shell.openExternal("https://decred.org/contributors/")
            }>
            <T id="aboutModal.paragraph2b" m="Decred contributors" />
          </a>
        </div>
        <div className={style.aboutTextParagraph}>
          <T
            id="aboutModal.paragraph3"
            m="Want to help or get involved, check out"
          />{" "}
          <a
            onClick={() =>
              shell.openExternal("https://github.com/decred/decrediton")
            }>
            github.com/decred/decrediton
          </a>
        </div>
      </div>
      <div className={style.aboutBottomArea}>
        <div className={style.aboutBottomAreaLeft}>
          <T id="aboutModal.version" m="Version" /> {version} -&nbsp;
          {updateAvailable ? (
            <a
              className={style.aboutUpgrade}
              onClick={() =>
                shell.openExternal(
                  "https://github.com/decred/decred-binaries/releases"
                )
              }>
              <T id="aboutModal.upgradeAvailable" m="Upgrade Available" />
            </a>
          ) : (
            <a
              className={style.aboutUpgrade}
              onClick={() =>
                shell.openExternal(
                  "https://github.com/decred/decred-binaries/releases/tag/v" +
                    `${version}`
                )
              }>
              <T id="aboutModal.whatsNew" m="What's New?" />
            </a>
          )}
        </div>
        <div className={style.aboutBottomAreaMiddle}>
          Copyright &copy; 2019{" "}
          <a onClick={() => shell.openExternal("https://decred.org")}>Decred</a>
        </div>
        <div className={style.aboutBottomAreaRight}>
          <a
            onClick={() =>
              shell.openExternal(
                "https://github.com/decred/decrediton/blob/master/LICENSE"
              )
            }>
            <T id="aboutModal.licensing" m="Licensing information" />
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default AboutModal;
