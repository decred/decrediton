import React from "react";
import { autobind } from "core-decorators";
import Select from "react-select";
import "../../react-select.global.css";
import { SEED_LENGTH, SEED_WORDS } from "../../../wallet/seed";

const SEED_WORD_OPTIONS = SEED_WORDS.map(name => ({ name }));

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
    return (
      <div
        className="section"
        style={{fontFamily: "Inconsolata,monospace"}}
        onKeyDown={this.handleKeyDown}
      >
        <Select.Async
          clearable={false}
          placeholder={"Enter your seed..."}
          multi={true}
          filterOptions={false}
          value={this.state.value}
          onChange={this.onChange}
          valueKey="name"
          labelKey="name"
          loadOptions={this.getSeedWords}
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

  handleKeyDown (e) {
    if (e.keyCode == 9 && this.state.value.length < SEED_LENGTH) {
      e.preventDefault();
    }
  }

}

export default SeedEntry;
