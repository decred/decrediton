import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

const CONTRIBUTORS = require('../helpers/english.js');
const MAX_CONTRIBUTORS = 6;
const ASYNC_DELAY = 500;

const Contributors = createClass({
	displayName: 'Contributors',
	getInitialState () {
    var seedList = Array();
    for (var i = 0; i < CONTRIBUTORS.length; i++){
      seedList.push({name: CONTRIBUTORS[i]});
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
	},
	getContributors (input, callback) {
		input = input.toLowerCase();
		var options = this.state.seedList.filter(i => {
			return i.name.toLowerCase().substr(0, input.length) === input;
		});
		var data = {
			options: options.slice(0, MAX_CONTRIBUTORS),
			complete: options.length <= MAX_CONTRIBUTORS,
		};
		setTimeout(function() {
			callback(null, data);
		}, ASYNC_DELAY);
	},
	render () {
		return (
			<div className="section">
			  <Select.Async multi={true} value={this.state.value} onChange={this.onChange} valueKey="name" labelKey="name" loadOptions={this.getContributors} />
			</div>
		);
	}
});

module.exports = Contributors;