// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import Button from './ButtonTanel';
import SideBar from './SideBar';
import qr from 'qr-image';

const styles = {
  body: {
    height: '100%'
  },
  content: {
    position: 'absolute',
    top: '70px',
    left: '252px',
    bottom: '0px',
    right: '0px',
  },
};

class Settings extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    currencyDisplay: PropTypes.string
  };

  render() {
    const { walletService, currencyDisplay } = this.props;
    const settings = (
      <div style={styles.content}>
        {currencyDisplay}
			</div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {settings}
        </div>);
    }
  }
}

export default Settings;
