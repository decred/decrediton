import InfoModal from "../InfoModal";
import { Documentation } from "shared";
import styles from "./DocumentationInfoModal.module.css";

const DocumentationInfoModal = ({ document, ...props }) => (
  <InfoModal
    {...props}
    modalContent={
      <Documentation name={document} className={styles.infoDocumentation} />
    }
  />
);

export default DocumentationInfoModal;
