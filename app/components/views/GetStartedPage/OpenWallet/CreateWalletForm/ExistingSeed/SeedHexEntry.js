import Input from "inputs/Input";
import { SEED_LENGTH } from "wallet/seed";
import { defineMessages, injectIntl } from "react-intl";

const messages = defineMessages({
  enterSeedPlaceholder: {
    id: "createWallet.enterSeed.placeholder",
    defaultMessage: "Enter your seed..."
  },
  enterHexSeedPlaceholder: {
    id: "createWallet.enterHexSeed.placeholder",
    defaultMessage: "Enter the hex representation of your seed..."
  }
});

@autobind
class SeedHexEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.isHexValid = this.isHexValid.bind(this);
  }

  getInitialState () {
    return {
      currentHex: "",
    };
  }

  render () {
    const { formatMessage } = this.props.intl;
    return (
      <Input
        onChange={this.onChange}
        value={this.state.currentHex}
        name='hexInput'
        placeholder={formatMessage(messages.enterHexSeedPlaceholder)}
      />
    );
  }

  onChange (val) {
    if (!this.isHexValid(val.target.value)) return;
    this.setState({
      currentHex: val.target.value,
    });
    this.props.onChange(val.target.value);
  }

  isHexValid(seed) {
    return /^[0-9a-fA-F]*$/.test(seed) && this.lengthInterval(seed);
  }

  lengthInterval(seed) {
    return seed.length <= SEED_LENGTH.HEX_MAX;
  }

  selectKeyDown (e) {
    switch(e.keyCode) {
    case 32:
      e.keyCode = 9;
      break;
    }
  }

  handleKeyDown (e) {
    switch(e.keyCode) {
    case 13:  // ENTER
      e.preventDefault();
      break;
    }
  }
}

export default injectIntl(SeedHexEntry);
