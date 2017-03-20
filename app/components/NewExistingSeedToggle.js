import Radium from 'radium';
import React from 'react';

const styles = {
  textToggle: {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    height: '44px',
    borderRadius: '5px',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, .2)',
    color: '#0c1e3e',
    fontSize: '13px',
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
    borderRadius: '5px',
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
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#69d5f7',
    },
    ':active': {
      boxShadow: '0 0 1px 0 rgba(0, 0, 0, .2)',
    },
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
  textToggleButtonDescriptionLeft: {
    width: '100%',
    height: '100%',
    textTransform: 'capitalize',
    paddingTop: '12px',
    paddingRight: '30px',
    paddingLeft: '40px',
    //textAlign: 'right',
  },
  textToggleButtonDescriptionRight: {
    width: '100%',
    height: '100%',
    textTransform: 'capitalize',
    display: 'block',
    paddingTop: '12px',
    paddingRight: '40px',
    paddingLeft: '30px',
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
    this.setState({ activeButton: side });
    this.props.toggleAction(side);
  }
  render() {
    const { leftText, rightText } = this.props;
    if (this.state.activeButton == 'left') {
      return (
        <div style={styles.textToggle}>
          <div style={styles.textToggleButtonActive}>
            <div style={styles.textToggleButtonDescriptionLeft}>{leftText}</div>
          </div>
          <div style={styles.textToggleButton} onClick={() => this.clickButton('right')}>
            <div style={styles.textToggleButtonDescriptionRight}>{rightText}</div>
          </div>
        </div>
      );
    } else if (this.state.activeButton == 'right') {
      return (
        <div style={styles.textToggle}>
          <div style={styles.textToggleButton} onClick={() => this.clickButton('left')}>
            <div style={styles.textToggleButtonDescriptionLeft}>{leftText}</div>
          </div>
          <div style={styles.textToggleButtonActive}>
            <div style={styles.textToggleButtonDescriptionRight}>{rightText}</div>
          </div>
        </div>
      );
    }
  }
}
export default Radium(NewExistingSeedToggle);