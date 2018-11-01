import { walletStartup } from "connectors";

@autobind
class GetStartedPosition extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.setLanguage) {
      this.props.onShowLanguage();
    } else if (this.props.showPrivacy) {
      this.props.onShowPrivacy();
    } else if (this.props.showSpvChoice) {
      this.props.onShowSpvChoice();
    } else if (this.props.showTutorial) {
      this.props.onShowTutorial();
    } else {
      this.props.onShowGetStarted();
    }
  }
  render() {
    return (<Aux>sadfsdf</Aux>);
  }
}

export default walletStartup(GetStartedPosition);
