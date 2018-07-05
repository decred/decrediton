import Modal from "../Modal";
import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";

const AboutModal = ({ show, onCancelModal }) => (
  <Modal className="about-modal" {...{ show, onCancelModal }}>
    <div className="about-modal-icon"/>
    <div className="about-modal-content">
      <div className="about-modal-title">
        <T id="aboutModal.decrediton" m="Decrediton" />
      </div>
      <div className="info-modal-close-button-top" onClick={onCancelModal}/>
      <div className="about-modal-text-paragraph">
        A cross platform GUI Wallet for Decred written in node.js using Electron
      </div>
      <div className="about-modal-text-paragraph">
        Decrediton is free and open source software, developed and designed by the global team of Decred contributors
      </div>
      <div className="about-modal-text-paragraph">
        Want to help or get involved, check out github.com/decred/decrediton
      </div>
    </div>
    <div className="about-modal-bottom-area">
      <div className="about-modal-bottom-area-left">
        Version 1.2.1 - <a onClick={() => shell.openExternal("https://github.com/decred/decred-binaries/releases/tag/v1.2.1")}>What's New?</a>
      </div>
      <div className="about-modal-bottom-area-middle">
        Copyright C 2018 <a onClick={() => shell.openExternal("https://decred.org")}>Decred</a>
      </div>
      <div className="about-modal-bottom-area-right">
        <a onClick={() => shell.openExternal("https://github.com/decred/decrediton/blob/master/LICENSE")}>Licensing information</a>
      </div>
    </div>
  </Modal>
);

export default AboutModal;
