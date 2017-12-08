import { PassphraseModal } from "modals";
import KeyBlueButton from "KeyBlueButton";
import "style/MiscComponents.less";

@autobind
class PassphraseModalButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: false};
  }

  showModal() {
    this.setState({show: true});
  }

  hideModal() {
    this.setState({show: false});
  }

  onSubmit(...args) {
    const { onSubmit } = this.props;
    this.hideModal();
    onSubmit && this.props.onSubmit(...args);
  }
  render() {
    const { modalTitle, modalDescription, modalContent, className, children, disabled, loading  } = this.props;
    const { show } = this.state;
    const { onSubmit } = this;

    return <Aux>
      <KeyBlueButton disabled={disabled} className={className} onClick={this.showModal} loading={loading}>
        {children}
      </KeyBlueButton>

      <PassphraseModal {...{show, title: modalTitle, Content: modalContent, description: modalDescription, onSubmit, onCancelModal: this.hideModal}}/>
    </Aux>;
  }
}

export default PassphraseModalButton;
