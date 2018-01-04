import Modal from "../Modal";
import ButtonsToolbar from "./ButtonsToolbar";
import PassphraseInputRow from "./PassphraseInputRow";

const propTypes = {
  title: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  description: PropTypes.object
};

const StandardPassphraseModal = (props) => {
  const { show, title, description, children } = props;

  return (
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
        {children}
        <PassphraseInputRow {...props} />
        <ButtonsToolbar {...props} />
      </div>
    </Modal>
  );
};

StandardPassphraseModal.propTypes = propTypes;

export default StandardPassphraseModal;
