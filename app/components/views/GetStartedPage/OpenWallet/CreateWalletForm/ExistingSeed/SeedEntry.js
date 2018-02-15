import Select from "react-select";
import PropTypes from "prop-types";
import Input from "inputs/Input";
import { SEED_LENGTH, SEED_WORDS } from "wallet/seed";
import { defineMessages, injectIntl } from "react-intl";

const SEED_WORD_OPTIONS = SEED_WORDS.map(name => ({ name }));

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
class SeedEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.getSeedWords = this.getSeedWords.bind(this);
    this.isHexValid = this.isHexValid.bind(this);
    this.lengthInterval = this.lengthInterval.bind(this);
  }

  getInitialState () {
    return {
      currentHex: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.seedType != this.props.seedType) {
      this.onChange(this.props.seedType === "words" ? [] : {target:{value:""}} );
    }
  }

  render () {
    const { formatMessage } = this.props.intl;
    const { seedType } = this.props;
    if(seedType === "hex") {
      return (
        <Input
          onChange={this.onChange}
          value={this.state.currentHex}
          onPaste={this.props.onPaste}
          name='hexInput'
          placeholder={formatMessage(messages.enterHexSeedPlaceholder)}
        />
      );
    }
    return (
      <div
        className="section words-input"
        style={{fontFamily: "Inconsolata,monospace"}}
        onKeyDown={this.handleKeyDown}
        onPaste={this.props.onPaste}
      >
        <Select.Async
          autoFocus
          clearable={false}
          placeholder={formatMessage(messages.enterSeedPlaceholder)}
          multi={true}
          filterOptions={false}
          value={this.props.seedWords}
          onChange={this.onChange}
          valueKey="name"
          labelKey="name"
          loadOptions={this.getSeedWords}
          onInputKeyDown={this.selectKeyDown}
        />
      </div>
    );
  }

  onChange (val) {
    const { seedType } = this.props;
    if(seedType === "hex") {
      if (!this.isHexValid(val.target.value)) return;
      this.setState({
        currentHex: val.target.value,
      });
      this.props.onChange(val.target.value);
    } else {
      if (!this.lengthInterval(val)) return;
      this.props.onChange(val);
    }
  }

  getSeedWords (input, callback) {
    input = input.toLowerCase();
    const options = SEED_WORD_OPTIONS
      .filter(i => i.name.toLowerCase().substr(0, input.length) === input);
    callback(null, {
      options: options.slice(0, SEED_LENGTH.WORDS),
      complete: this.props.seedWords.length >= SEED_LENGTH.WORDS,
    });
  }

  isHexValid(seed) {
    return /^[0-9a-fA-F]*$/.test(seed) && this.lengthInterval(seed);
  }

  lengthInterval(seed) {
    return this.props.seedType === "hex" ? seed.length <= SEED_LENGTH.HEX_MAX : seed.length <= SEED_LENGTH.WORDS;
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
    case 9:   // TAB
      if(this.props.seedType === "words" && this.props.seedWords.length < SEED_LENGTH.WORDS) {
        e.preventDefault();
      }
      break;
    case 13:  // ENTER
      e.preventDefault();
      break;
    }
  }
}

SeedEntry.prototypes = {
  seedType: PropTypes.string,
  seedWords: PropTypes.array.isRequired,
};

SeedEntry.defaultProps = {
  seedType: "words",
};

export default injectIntl(SeedEntry);
