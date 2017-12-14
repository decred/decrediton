import Modal from "../Modal";
import { SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";
import PassphraseModalContent from "../PassphraseModalContent";

const propTypes = {
  title: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  description: PropTypes.object
};

const PassphraseModal = ({title, description, Content, show, onCancelModal, onSubmit}) => (
  <Modal className="passphrase-modal" {...{show}}>
    <div className="passphrase-modal-header">
      <div className="passphrase-modal-header-title">
        {title}
      </div>
      <div className="passphrase-modal-header-description">
        {description}
      </div>
    </div>
    <div className="passphrase-modal-content">
      {!Content ? <PassphraseModalContent {...{onSubmit}}/> : <Content {...{onSubmit}} />}
    </div>
    <SlateGrayButton className="passphrase-modal-close-button" onClick={onCancelModal}>
      <T id="passphraseModal.btnCancel" m="Cancel" />
    </SlateGrayButton>
  </Modal>
);

PassphraseModal.propTypes = propTypes;

export default PassphraseModal;
