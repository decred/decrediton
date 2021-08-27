import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import styles from "./LNChannelModal.module.css";

const LNChannelModal = ({
  show,
  onCancelModal,
  detailsTable,
  channelCard,
  closeButton
}) => (
  <Modal className={styles.modal} {...{ show, onCancelModal }}>
    <div
      className={styles.closeButton}
      onClick={onCancelModal}
      data-testid="lnchannel-close-button"
    />
    <div className={styles.title}>
      <T id="ln.channelModal.title" m="Channel Created" />
    </div>
    {channelCard}
    {detailsTable}
    {closeButton && (
      <div className={styles.buttonContrainer}>{closeButton}</div>
    )}
  </Modal>
);
export default LNChannelModal;
