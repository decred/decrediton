import Modal from "../Modal";
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
      {!Content ? <PassphraseModalContent {...{onSubmit, onCancelModal}}/> : <Content {...{onSubmit, onCancelModal}} />}
    </div>
  </Modal>
);

PassphraseModal.propTypes = propTypes;

export default PassphraseModal;
