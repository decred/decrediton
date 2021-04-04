import Modal from "../Modal";
import { ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";
import { useAboutModal } from "./hooks";
import styles from "./AboutModal.module.css";

const AboutModal = ({ show, onCancelModal }) => {
  const { version, updateAvailable } = useAboutModal();

  return (
    <Modal className={styles.about} {...{ show, onCancelModal }}>
      <div className={styles.aboutIcon} />
      <div className={styles.aboutContent}>
        <div className={styles.aboutTitle}>
          <T id="aboutModal.decrediton" m="Decrediton" />
        </div>
        <div
          className={styles.infoModalCloseButtonTop}
          onClick={onCancelModal}
        />
        <div className={styles.aboutTextParagraph}>
          <T
            id="aboutModal.paragraph1"
            m="A cross platform GUI Wallet for Decred written in node.js using Electron"
          />
        </div>
        <div className={styles.aboutTextParagraph}>
          <T
            id="aboutModal.paragraph2a"
            m="Decrediton is free and open source software, developed and designed by the global team of"
          />{" "}
          <ExternalLink href="https://decred.org/contributors/">
            <T id="aboutModal.paragraph2b" m="Decred contributors" />
          </ExternalLink>
        </div>
        <div className={styles.aboutTextParagraph}>
          <T
            id="aboutModal.paragraph3"
            m="Want to help or get involved, check out"
          />{" "}
          <ExternalLink href="https://github.com/decred/decrediton">
            github.com/decred/decrediton
          </ExternalLink>
        </div>
      </div>
      <div className={styles.aboutBottomArea}>
        <div>
          <T id="aboutModal.version" m="Version" /> {version} -&nbsp;
          {updateAvailable ? (
            <ExternalLink
              href="https://github.com/decred/decred-binaries/releases"
              className={styles.aboutUpgrade}>
              <T id="aboutModal.upgradeAvailable" m="Upgrade Available" />
            </ExternalLink>
          ) : (
            <ExternalLink
              href={`https://github.com/decred/decred-binaries/releases/tag/v${version}`}
              className={styles.aboutUpgrade}>
              <T id="aboutModal.whatsNew" m="What's New?" />
            </ExternalLink>
          )}
        </div>
        <div className={styles.aboutBottomAreaMiddle}>
          Copyright &copy; 2020{" "}
          <ExternalLink href="https://decred.org">Decred</ExternalLink>
        </div>
        <div className={styles.aboutBottomAreaRight}>
          <ExternalLink href="https://github.com/decred/decrediton/blob/master/LICENSE">
            <T id="aboutModal.licensing" m="Licensing information" />
          </ExternalLink>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
