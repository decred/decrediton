import { ListUTXOsModal } from "modals";
import ModalButton from "../ModalButton";
import InvisibleButton from "../InvisibleButton";
import { FormattedMessage as T } from "react-intl";
import styles from "./ListUTXOsButton.module.css";

const ListUTXOsButton = () => (
  <ModalButton
    buttonComponent={InvisibleButton}
    modalComponent={ListUTXOsModal}
    className={styles.button}
    buttonLabel={<T id="buttons.listutxos" m="List UTXOs" />}
  />
);

export default ListUTXOsButton;
