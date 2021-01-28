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

@autobind
class ModalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  showModal() {
    this.setState({ show: true });
    this.onShow();
  }

  hideModal() {
    this.setState({ show: false });
  }

  onSubmit(...args) {
    const { onSubmit } = this.props;
    this.hideModal();
    onSubmit && this.props.onSubmit(...args);
  }

  onShow() {
    const { onShow } = this.props;
    onShow && this.props.onShow();
  }

  componentDidUpdate(prevProps) {
    if (this.props.showModal && !prevProps.modal) {
      this.showModal();
    }
  }

  handleOnClick() {
    const { isValid, onClick } = this.props;
    onClick && onClick();
    // isValid can be not passed, so we ignore it.
    if (isValid !== undefined && !isValid) {
      return;
    }
    this.showModal();
  }

  render() {
    const { buttonLabel, modalComponent, isDisabled } = this.props;
    const ButtonComponent = this.props.buttonComponent || defaultButton;
    const { show } = this.state;
    const { onSubmit } = this;
    const Modal = modalComponent;

    return (
      <>
        <ButtonComponent
          {...this.props}
          onClick={!isDisabled ? this.handleOnClick : null}>
          {buttonLabel}
        </ButtonComponent>

        <Modal
          {...{
            ...this.props,
            show,
            onSubmit,
            onCancelModal: this.hideModal
          }}
        />
      </>
    );
  }
}

export default ModalButton;
