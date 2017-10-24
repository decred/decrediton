import React from "react";
import { autobind } from "core-decorators";
import Select from "react-select";
import { SEED_LENGTH, SEED_WORDS } from "../../../wallet/seed";
import { defineMessages, injectIntl } from "react-intl";

const SEED_WORD_OPTIONS = SEED_WORDS.map(name => ({ name }));

const messages = defineMessages({
  enterSeedPlaceholder: {
    id: "createWallet.enterSeed.placeholder",
    defaultMessage: "Enter your seed..."
  }
});

@autobind
class SeedEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState () {
    return {
      value: Array()
    };
  }

  render () {
    const { formatMessage } = this.props.intl;

    return (
      <div
        className="section"
        style={{fontFamily: "Inconsolata,monospace"}}
        onKeyDown={this.handleKeyDown}
        onPaste={this.props.onPaste}
      >
        <Select.Async
          autofocus
          clearable={false}
          placeholder={formatMessage(messages.enterSeedPlaceholder)}
          multi={true}
          filterOptions={false}
          value={this.state.value}
          onChange={this.onChange}
          valueKey="name"
          labelKey="name"
          loadOptions={this.getSeedWords}
          onInputKeyDown={this.selectKeyDown}
        />
      </div>
    );
  }

  onChange (value) {
    this.setState({
      value: value,
    });

    this.props.onChange(value);
  }

  getSeedWords (input, callback) {
    input = input.toLowerCase();
    const options = SEED_WORD_OPTIONS
      .filter(i => i.name.toLowerCase().substr(0, input.length) === input);
    callback(null, {
      options: options.slice(0, SEED_LENGTH),
      complete: this.state.value.length >= SEED_LENGTH,
    });
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
      if(this.state.value.length < SEED_LENGTH) {
        e.preventDefault();
      }
      break;
    case 13:  // ENTER
      e.preventDefault();
      break;
    }
  }

}

export default injectIntl(SeedEntry);
