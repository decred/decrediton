// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import Button from '../ButtonTanel';
import SideBar from '../SideBar';
import Header from '../Header';
import qr from 'qr-image';

const styles = {
  body: {
    position: 'fixed',
    left: '0px',
    top: '50%',
    right: '0px',
    display: 'block',
    overflow: 'hidden',
    width: '1178px',
    height: '770px',
    marginTop: '-385px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#FFF',
  },
  view: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  img: {
    width: '250px',
    paddingLeft: '244px',
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

class StakePool extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService } = this.props;
    const { stakePoolInfoConfig } = this.props;
    var selectStakePool = (
      <div style={styles.selectStakePoolArea}>
        <select
          defaultValue={0}
          style={styles.selectStakePool}
          >
          {stakePoolInfoConfig !== null ?
            stakePoolInfoConfig.map((stakePool) => {
              return (
                <option style={styles.selectStakePoolNFirst} key={stakePool.Host} value={stakePool.Host}>
                  {stakePool.Host}
                </option>
              );
             }):
            null
          }
        </select>
      </div>);
    const copayReceive = (
      <div style={styles.view}>
        <Header
          headerTitleOverview="Stake pool settings"
          headerMetaOverview={<div></div>}
        />
        <div style={styles.content}>
          <div style={styles.center}>
            {selectStakePool}
          </div>
        </div>
			</div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <SideBar />
          {copayReceive}
        </div>);
    }
  }
}

export default StakePool;
