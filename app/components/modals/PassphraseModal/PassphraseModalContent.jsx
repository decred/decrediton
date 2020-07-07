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
      className={classNames(style.passphrase, modalClassName)}
      {...{ show, onCancelModal }}>
      <div className={style.passphraseHeader}>
        <div className={style.passphraseHeaderTitle}>
          {modalTitle ? (
            modalTitle
          ) : (
            <T
              id="passphraseModal.confirmationRequired"
              m="Confirmation Required"
            />
          )}
        </div>
        <div className={style.passphraseHeaderDescription}>
          {modalDescription}
        </div>
      </div>
      <div className={style.passphraseContent}>
        {prependPassphraseRow ? inputRow : null}
        {children}
        {prependPassphraseRow ? null : inputRow}
      </div>
      <ButtonsToolbar {...{ ...props, onCancelModal }} />
    </DefaultModal>
  );
};

export default Modal;
