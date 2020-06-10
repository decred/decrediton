import DefaultModal from "../Modal";
import ButtonsToolbar from "./PassphraseModalButtonsToolbar";
import PassphraseInputRow from "./PassphraseModalInputRow";
import { FormattedMessage as T } from "react-intl";
import style from "../Modals.module.css";
import { classNames } from "pi-ui";

const Modal = ({
  modalClassName,
  show,
  modalDescription,
  modalTitle,
  children,
  prependPassphraseRow,
  onCancelModal,
  ...props
}) => {
  const inputRow = (
    <PassphraseInputRow
      {...{
        ...props,
        autoFocusPassword: prependPassphraseRow || !children
      }}
    />
  );

  return (
    <DefaultModal
      className={classNames(style.passphraseModal, modalClassName)}
      {...{ show, onCancelModal }}>
      <div className={style.passphraseModalHeader}>
        <div className={style.passphraseModalHeaderTitle}>
          {modalTitle ? (
            modalTitle
          ) : (
            <T
              id="passphraseModal.confirmationRequired"
              m="Confirmation Required"
            />
          )}
        </div>
        <div className={style.passphraseModalHeaderDescription}>
          {modalDescription}
        </div>
      </div>
      <div className={style.passphraseModalContent}>
        {prependPassphraseRow ? inputRow : null}
        {children}
        {prependPassphraseRow ? null : inputRow}
      </div>
      <ButtonsToolbar {...{ ...props, onCancelModal }} />
    </DefaultModal>
  );
};

export default Modal;
