import Modal from "../Modal";
import { ExternalLink } from "shared";
import { FormattedMessage as T } from "react-intl";
import { useAboutModal } from "./hooks";
import styles from "./AboutModal.module.css";

const AboutModal = ({ show, onCancelModal }) => {
  const { version, updateAvailable } = useAboutModal();

  return (
    <Modal className={styles.about} {...{ show, onCancelModal }}>
      <div className={styles.icon} />
      <div className={styles.content}>
        <div className={styles.title}>
          <T id="aboutModal.decrediton" m="Decrediton" />
        </div>
        <div className={styles.closeButtonTop} onClick={onCancelModal} />
        <p>
          <T
            id="aboutModal.paragraph1"
            m="A cross platform GUI Wallet for Decred written in node.js using Electron"
          />
        </p>
        <p>
          <T
            id="aboutModal.paragraph2a"
            m="Decrediton is free and open source software, developed and designed by the global team of"
          />{" "}
          <ExternalLink href="https://decred.org/contributors/">
            <T id="aboutModal.paragraph2b" m="Decred contributors" />
          </ExternalLink>
        </p>
        <p>
          <T
            id="aboutModal.paragraph3"
            m="Want to help or get involved, check out"
          />{" "}
          <ExternalLink href="https://github.com/decred/decrediton">
            github.com/decred/decrediton
          </ExternalLink>
        </p>
      </div>
      <div className={styles.bottomArea}>
        <div className={styles.wrapper}>
          <div>
            <T id="aboutModal.version" m="Version" /> {version} -&nbsp;
            {updateAvailable ? (
              <ExternalLink
                href="https://github.com/decred/decred-binaries/releases"
                className={styles.upgrade}>
                <T id="aboutModal.upgradeAvailable" m="Upgrade Available" />
              </ExternalLink>
            ) : (
              <ExternalLink
                href={`https://github.com/decred/decred-binaries/releases/tag/v${version}`}
                className={styles.upgrade}>
                <T id="aboutModal.whatsNew" m="What's New?" />
              </ExternalLink>
            )}
          </div>
          <div className={styles.bottomAreaMiddle}>
            Copyright &copy; 2020-2024{" "}
            <ExternalLink href="https://decred.org">Decred</ExternalLink>
          </div>
          <div className={styles.bottomAreaRight}>
            <ExternalLink href="https://github.com/decred/decrediton/blob/master/LICENSE">
              <T id="aboutModal.licensing" m="Licensing information" />
            </ExternalLink>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
