import Modal from "../Modal";
import SlateGrayButton from "SlateGrayButton";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";

const propTypes = {
  title: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  onCancelModal: PropTypes.func.isRequired
};

const PassphraseModal = ({title, children, show, onCancelModal}) => (
  <Modal className="passphrase-modal" {...{show}}>
     <div className="passphrase-modal-header">
       <div className="passphrase-modal-header-title">
         {title}
       </div>
       <SlateGrayButton className="passphrase-modal-close-button" onClick={onCancelModal}>
         <T id="passphraseModal.btnCancel" m="Cancel" />
       </SlateGrayButton>
     </div>
     <div className="passphrase-modal-content">
       {children}
     </div>
  </Modal>
);

PassphraseModal.propTypes = propTypes;

export default PassphraseModal;
