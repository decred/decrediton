import Radium from 'radium';
import React from 'react';
import ArrowDownMidBlue from './icons/arrow-down-mid-blue.svg';
import ArrowDownKeyBlue from './icons/arrow-down-key-blue.svg';
import ArrowUpLightBlue from './icons/arrow-up-light-blue.svg';
import ArrowUpTurquiose from './icons/arrow-up-turquiose.svg';

var styles = {
  showAdvanced: {
    float: 'right',
    width: '100px',
    height: '34px',
    paddingTop: '10px',
    paddingLeft: '20px',
    backgroundColor: '#fff',
    backgroundImage: `url(${ArrowDownMidBlue})`,
    backgroundPosition: '0% 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    ':hover': {
      backgroundImage: `url(${ArrowDownKeyBlue})`,
      backgroundSize: '10px',
    }
  },
  hideAdvanced: {
    float: 'right',
    width: '100px',
    height: '34px',
    paddingTop: '11px',
    paddingLeft: '20px',
    backgroundColor: '#fff',
    backgroundImage: `url(${ArrowUpLightBlue})`,
    backgroundPosition: '0% 50%',
    backgroundSize: '10px',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    ':hover': {
      backgroundImage: `url(${ArrowUpTurquiose})`,
      backgroundSize: '10px',
    }
  },
  block: {
    display: 'block',
  },
};

class HideShowButton extends React.Component {
  render() {
    return (
      <div
        style={this.props.showAdvanced ?
            styles.showAdvanced :
            styles.hideAdvanced}
        type={this.props.type}
        onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Radium(HideShowButton);