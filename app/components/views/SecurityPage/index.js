import SecurityPageHeader from "./Header";
import { securityPage } from "connectors";
import { autobind } from "core-decorators";
import FormSelector from "./FormSelector";
import { injectIntl, defineMessages, intlShape } from "react-intl";

@autobind
class SecurityPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      form: 0,
    };
  }

  render() {
    return (
      <Aux>
        <SecurityPageHeader />
        <FormSelector        
          {...{
            ...this.props,
            ...this.state,
            formatMessage: this.props.intl.formatMessage,
            rpcError: false,
            onSubmit: null,
            onShowSignMessageInfo: null
            
          }}
        />
      </Aux>
    );
  }
}

export default injectIntl(securityPage(SecurityPage));
