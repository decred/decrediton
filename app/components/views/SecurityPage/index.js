import { FormattedMessage as T } from "react-intl";
import { StandalonePage, StandaloneHeader } from "layout";
import { default as SignTab } from "./SignMessage";
import { default as ValidateAddressTab } from "./ValidateAddress";
import { default as VerifyMessageTab } from "./VerifyMessage";

const SecurityHeader = () =>
  <StandaloneHeader
    iconClassName="security"
    title={<T id="security.title" m="Security Center" />}
    description={<T id="security.description" m="Various tools that help in different aspects of crypto currency security will be located here." />}
  />;

@autobind
class SecurityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      sideActive: true
    };
  }

  componentWillUnmount() {
    this.resetState();
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  render() {
    const { sideActive } = this.state;
    const { onShowSign, onShowVerify } = this;
    return (
      <StandalonePage header={<SecurityHeader />}>
        <Aux>
          <div className="advanced-page-toggle security-page">
            <div className="text-toggle">
              <div className={"text-toggle-button-left " + (sideActive && "text-toggle-button-active")} onClick={!sideActive ? onShowVerify : null}>
                <T id="security.signTitle" m="Sign Message" />
              </div>
              <div className={"text-toggle-button-right " + (!sideActive && "text-toggle-button-active")} onClick={sideActive ? onShowSign : null}>
                <T id="security.verifyTitle" m="Verify Message" />
              </div>
            </div>
          </div>
          <div className="security-page-form">
            {sideActive ?
              <SignTab /> : <VerifyMessageTab />
            }
          </div>
        </Aux>
        <ValidateAddressTab />
      </StandalonePage>
    );
  }

  onShowSign() {
    this.setState({ sideActive: false });
  }
  onShowVerify() {
    this.setState({ sideActive: true });
  }
}

export default SecurityPage;
