import React from 'react';
import createClass from 'create-react-class';
import Select from 'react-select';

const SEED_WORDS = require('../helpers/wordlist.js');
const MAX_SEED_WORDS = 33;
const ASYNC_DELAY = 100;

const ConfirmSeed = createClass({
  displayName: 'Confim Seed',
  getInitialState () {
    var seedList = Array();
    SEED_WORDS.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    for (var i = 0; i < SEED_WORDS.length; i++){
      seedList.push({name: SEED_WORDS[i]});
    }
    return {
      seedList: seedList,
      value: Array(),
    };
  },
  onChange (value) {
    this.setState({
      value: value,
    });
    this.props.checkSeedMatch(value);
  },
  getSeedWords (input, callback) {
    input = input.toLowerCase();
    var options = this.state.seedList.filter(i => {
      return i.name.toLowerCase().substr(0, input.length) === input;
    });
    var data = {
      options: options.slice(0, MAX_SEED_WORDS),
      complete: this.state.value.length >= MAX_SEED_WORDS,
    };
    setTimeout(function() {
      callback(null, data);
    }, ASYNC_DELAY);
  },
  handleKeyDown (e) {
    if (e.keyCode == 9 && this.state.value.length < MAX_SEED_WORDS) {
      e.preventDefault();
    }
  },
  render () {
    return (
			<div className="section" style={{fontFamily: 'Inconsolata,monospace'}} onKeyDown={(e) => this.handleKeyDown(e)}>
				<Select.Async clearable={false} placeholder={'Enter your seed...'} multi={true} filterOptions={false} value={this.state.value} onChange={this.onChange} valueKey="name" labelKey="name" loadOptions={this.getSeedWords} />
			</div>
    );
  }
});

module.exports = ConfirmSeed;