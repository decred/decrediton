import { useState } from "react";

const defaultButton = ({
  onClick,
  isDisabled,
  buttonLabel,
  className,
  ariaLabelledBy
}) => (
  <button
    onClick={onClick}
    className={className}
    aria-labelledby={ariaLabelledBy}>
    {buttonLabel}
    {isDisabled}
  </button>
);

const ModalButton = ({
  showModal,
  isValid,
  buttonLabel,
  modalComponent,
  isDisabled,
  buttonComponent,
  onSubmit,
  onShow,
  onClick,
  onValidate,
  ...props
}) => {
  const [show, setShow] = useState(!!showModal);

  const onShowModal = () => {
    setShow(true);
    onShow?.();
  };

  const hideModal = () => {
    setShow(false);
  };

  const localOnSubmit = (...args) => {
    hideModal();
    onSubmit?.(...args);
  };

  const handleOnClick = async () => {
    onClick?.();
    let isModalValid = isValid;
    if (onValidate) {
      isModalValid = await onValidate();
    }
    // isValid can be not passed, so we ignore it.
    if (isModalValid !== undefined && !isModalValid) {
      return;
    }
    onShowModal();
  };

  const ButtonComponent = buttonComponent || defaultButton;
  const Modal = modalComponent;

  return (
    <>
      <ButtonComponent {...props} onClick={!isDisabled ? handleOnClick : null}>
        {buttonLabel}
      </ButtonComponent>

      <Modal
        {...{
          ...props,
          show,
          onSubmit: localOnSubmit,
          onCancelModal: hideModal
        }}
      />
    </>
  );
};

export default ModalButton;
