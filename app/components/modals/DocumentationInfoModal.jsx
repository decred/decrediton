import InfoModal from "./InfoModal";
import { Documentation } from "shared";
import style from "./Modals.module.css";

const DocumentationInfoModal = ({ document, ...props }) => (
  <InfoModal
    {...props}
    modalContent={
      <Documentation name={document} className={style.infoDocumentation} />
    }
  />
);

export default DocumentationInfoModal;
