import { PassphraseModal } from "modals";
import AutoBuyerSwitch from "AutoBuyerSwitch";
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
    const { modalTitle, modalContent, enabled } = this.props;
    const { show } = this.state;

    return <Aux>
      <AutoBuyerSwitch enabled={enabled} onClick={this.showModal} />

      <PassphraseModal {...{show, title: modalTitle, onCancelModal: this.hideModal}}>
        {modalContent}
      </PassphraseModal>
    </Aux>;
  }
}

export default PassphraseModalButton;
