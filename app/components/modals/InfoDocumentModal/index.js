import InfoModal from "../InfoModal/Modal";
import { Documentation } from "shared";

export default ({ document, ...props }) => (
  <InfoModal
    {...props}
    modalContent={<Documentation name={document} className="info-modal-documentation" />}
  />
);
