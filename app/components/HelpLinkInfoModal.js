import { InfoModal } from "modals";
import "style/MiscComponents.less";

@autobind
class HelpLinkInfoModal extends React.Component {

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
    const { modalTitle, modalContent, className, children } = this.props;
    const { show } = this.state;

    return <Aux>
      <div className={"help-icon " + className} onClick={this.showModal}>
        {children}
      </div>

      <InfoModal {...{show, title: modalTitle, onHideModal: this.hideModal}}>
        {modalContent}
      </InfoModal>
    </Aux>;
  }
}

export default HelpLinkInfoModal;
