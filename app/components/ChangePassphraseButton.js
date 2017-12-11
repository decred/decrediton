import { PassphraseModal } from "modals";
import "style/MiscComponents.less";

@autobind
class ChangePassphraseButton extends React.Component {

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
    const { modalTitle, modalDescription, modalContent } = this.props;
    const { show } = this.state;
    const { onSubmit } = this;

    return <Aux>
        <button className="change-password-default-icon" onClick={this.showModal} />

        <PassphraseModal {...{show, title: modalTitle, Content: modalContent, description: modalDescription, onSubmit, onCancelModal: this.hideModal}}/>
      </Aux>;
  }
}

export default ChangePassphraseButton;
