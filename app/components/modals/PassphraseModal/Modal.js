import Modal from "../Modal";
import ButtonsToolbar from "./ButtonsToolbar";
import PassphraseInputRow from "./PassphraseInputRow";

const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  description: PropTypes.object
};

const StandardPassphraseModal = (props) => {
  const {
    show,
    modalTitle,
    modalDescription,
    children,
    prependPassphraseRow
  } = props;

  const inputRow =
    <PassphraseInputRow
      {...{
        ...props,
        autoFocusPassword: prependPassphraseRow || !children
      }}
    />;

  return (
    <Modal className="passphrase-modal" {...{show}}>
      <div className="passphrase-modal-header">
        <div className="passphrase-modal-header-title">
          {modalTitle}
        </div>
        <div className="passphrase-modal-header-description">
          {modalDescription}
        </div>
      </div>
      <div className="passphrase-modal-content">
        {prependPassphraseRow ? inputRow : null}
        {children}
        {prependPassphraseRow ? null : inputRow}
        <ButtonsToolbar {...props} />
      </div>
    </Modal>
  );
};

StandardPassphraseModal.propTypes = propTypes;

export default StandardPassphraseModal;
