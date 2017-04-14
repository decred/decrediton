import Radium from 'radium';
import React from 'react';

const styles = {
  textToggle: {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    height: '44px',
    borderRadius: '3px',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, .2)',
    color: '#0c1e3e',
    fontSize: '15px',
  },

  textToggleNewSeed: {
    overflow: 'hidden',
    height: '44px',
    borderRadius: '5px',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, .2)',
    color: '#0c1e3e',
    fontSize: '13px',
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    display: 'inline-block',
    marginRight: '60px',
    marginBottom: '40px',
    float: 'right',
  },

  textToggleExistingSeed: {
    display: 'inline-block',
    overflow: 'hidden',
    height: '44px',
    borderRadius: '3px',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, .2)',
    color: '#0c1e3e',
    fontSize: '13px',
    marginRight: '60px',
    marginBottom: '40px',
  },

  textToggleButton: {
    display: 'block',
    overflow: 'hidden',
    height: '44px',
    minWidth: '140px',
    float: 'left',
    backgroundColor: '#e9f8fe',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, .2)',
    transitionProperty: 'all',
    transitionDuration: '100ms',
    transitionTimingFunction: 'cubic-bezier(0.86, 0, 0.07, 1)',
    transitionDelay: '0s',
    cursor: 'pointer',
    /*
    ':hover': {
      backgroundColor: '#69d5f7',
    },
    ':active': {
      backgroundColor: '#0c1e3e',
      boxShadow: '0 0 1px 0 rgba(0, 0, 0, .2)',
    },
    */
  },
  textToggleButtonActive: {
    display: 'block',
    overflow: 'hidden',
    height: '44px',
    minWidth: '140px',
    float: 'left',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, .2)',
    backgroundColor: '#0c1e3e',
    color: '#fff',
    cursor: 'default',
  },
  textToggleButtonDescription: {
    width: '100%',
    height: '100%',
    textTransform: 'capitalize',
    display: 'block',
    paddingTop: '12px',
    paddingRight: '35px',
    paddingLeft: '35px',
      //textAlign: 'left',
  }
};
class NewExistingSeedToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: this.props.activeButton,
    };
  }
  clickButton(side) {
    this.setState({activeButton:side});
    this.props.toggleAction(side);
  }
  render() {
    const { leftText, rightText } = this.props;
    return (
      <div style={styles.textToggle}>
        <div style={this.state.activeButton == 'right' ? styles.textToggleButton : styles.textToggleButtonActive } onClick={this.state.activeButton == 'right' ? () => this.clickButton('left') : null}>
          <div style={styles.textToggleButtonDescription}>{leftText}</div>
        </div>
        <div style={this.state.activeButton == 'left' ? styles.textToggleButton : styles.textToggleButtonActive } onClick={this.state.activeButton == 'left' ? () => this.clickButton('right') : null}>
          <div style={styles.textToggleButtonDescription}>{rightText}</div>
        </div>
      </div>
    );
  }
}
export default Radium(NewExistingSeedToggle);