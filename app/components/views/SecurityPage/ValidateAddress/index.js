import ValidateAddressForm from "./Form";
import { validateAddressPage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class ValidateAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return ({
      address: "",
      error: null
    });
  }

  componentDidMount () {
    this.props.validateAddressCleanStore();
  }

  componentWillUnmount() {
    this.props.validateAddressCleanStore();
  }

  render() {
    const { validateAddressSuccess } = this.props;
    const { address, error } = this.state;
    const { onAddressChange, onAddressBlur } = this;

    return (
      <ValidateAddressForm {...{ onAddressChange, onAddressBlur, address,
        validateAddressSuccess, error }}/>
    );
  }

  onAddressChange(address) {
    if (address == "") {
      this.setState({ address, error: null });
      return;
    }
    this.props.validateAddress(address)
      .then(resp => {
        this.setState({ address, error: !resp.getIsValid() ? "Please enter a valid address" : null });
      })
      .catch(error => {
        console.error(error);
        this.setState({ address, error: "Error: Address validation failed, please try again." });
      });
  }
}

export default validateAddressPage(ValidateAddress);
