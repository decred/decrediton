
const defaultButton = ({ onClick, enabled, buttonLabel, className }) =>
  (<button onClick={onClick} enabled={enabled} className={className}>{buttonLabel}</button>);

@autobind
class ModalButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  onSubmit(...args) {
    const { onSubmit } = this.props;
    this.hideModal();
    onSubmit && this.props.onSubmit(...args);
  }

  render() {
    const { buttonLabel, modalComponent } = this.props;
    const ButtonComponent = this.props.buttonComponent || defaultButton;
    const { show } = this.state;
    const { onSubmit } = this;
    const Modal = modalComponent;

    return <Aux>
      <ButtonComponent {...this.props} onClick={this.showModal}>
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
    </Aux>;
  }
}

export default ModalButton;
