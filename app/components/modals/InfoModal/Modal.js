import Modal from "../Modal";
import { SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";

const propTypes = {
  title: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  onHideModal: PropTypes.func.isRequired
};

const InfoModal = ({title, children, show, onHideModal}) => (
  <Modal className="info-modal" {...{show}}>
     <div className="info-modal-header">
       <div className="info-modal-header-title">
         {title}
       </div>
       <SlateGrayButton className="info-modal-close-button" onClick={onHideModal}>
         <T id="infoModal.btnClose" m="Close" />
       </SlateGrayButton>
     </div>
     <div className="info-modal-content">
       {children}
     </div>
  </Modal>
);

InfoModal.propTypes = propTypes;

export default InfoModal;
