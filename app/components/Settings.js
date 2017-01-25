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
  };

  render() {
    const settings = (
      <div style={styles.content}>

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

export default Receive;
