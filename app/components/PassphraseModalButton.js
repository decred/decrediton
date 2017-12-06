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

  render() {
    const { modalTitle, modalDescription, modalContent, className, children, disabled } = this.props;
    const { show } = this.state;

    return <Aux>
      <KeyBlueButton disabled={disabled} className={className} onClick={this.showModal}>
        {children}
      </KeyBlueButton>

      <PassphraseModal {...{show, title: modalTitle, description: modalDescription, onCancelModal: this.hideModal}}>
        {modalContent}
      </PassphraseModal>
    </Aux>;
  }
}

export default PassphraseModalButton;
