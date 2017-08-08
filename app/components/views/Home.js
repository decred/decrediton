// @flow
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import LinearProgress from "material-ui/LinearProgress";
import StakeyBounce from "../StakeyBounce";
import KeyBlueButton from "../KeyBlueButton";
import ErrorScreen from "../ErrorScreen";
import Balance from "../Balance";
import SideBar from "../SideBar";
import TxHistory from "../TxHistory";
import Header from "../Header";
import "../fonts.css";
import { HomeStyles } from "./ViewStyles";
import ReactToolTip from "react-tooltip";

class Home extends Component{
  constructor(props) {
    super(props);
  }

  static propTypes = {
    walletService: PropTypes.object,

    getBalanceRequestAttempt: PropTypes.bool.isRequired,
    getStakeInfoRequestAttempt: PropTypes.bool.isRequired,
  }

  handleBalanceClick = () => {
    this.props.getAccountsAttempt();
  }

  render() {
    const { walletService } = this.props;
    const { regularTransactionsInfo, txPerPage } = this.props;
    const { balances } = this.props;
    const { getTransactionsRequestAttempt } = this.props;
    const { rescanRequest, rescanResponse } = this.props;
    const { getAccountsResponse } = this.props;
    const { synced } = this.props;
    const { unmined } = this.props;

    var transactionMessage = "";
    if (regularTransactionsInfo.length == 0) {
      transactionMessage = "No transactions";
    }
    var paginatedTxs = unmined.length > 0 ?
    unmined.length > txPerPage ? Array() :
    regularTransactionsInfo.length + unmined.length >= txPerPage  ? regularTransactionsInfo.slice(0,txPerPage-unmined.length) : regularTransactionsInfo.slice(0,regularTransactionsInfo.length+unmined.length):
    regularTransactionsInfo.length >= txPerPage  ? regularTransactionsInfo.slice(0,txPerPage) : regularTransactionsInfo.slice(0,regularTransactionsInfo.length);

    var rescanPercFisnished = 0.00;
    if (rescanResponse !== null && getAccountsResponse !== null && rescanRequest != null) {
      var totalBlocks = getAccountsResponse.getCurrentBlockHeight() - rescanRequest.getBeginHeight();
      var blocksFinished = rescanResponse.getRescannedThrough() - rescanRequest.getBeginHeight();
      rescanPercFisnished = (blocksFinished / totalBlocks) * 100;
      rescanPercFisnished = rescanPercFisnished.toFixed(2);
    }
    var totalBalance = 0;
    if (balances !== null) {
      for (var i = 0; i < balances.length; i++) {
        if (balances[i].accountName !== "imported") {
          totalBalance += balances[i].spendable;
        }
      }
    }
    const homeView = (
      <div style={HomeStyles.view}>
        {rescanRequest ?
          <Header headerTitleOverview="Rescanning"
            headerMetaOverview={
            <div style={HomeStyles.rescanProgressArea} >
              <LinearProgress mode="determinate"
                min={rescanRequest !== null ? rescanRequest.getBeginHeight(): 0}
                max={getAccountsResponse !== null ? getAccountsResponse.getCurrentBlockHeight(): 100}
                value={rescanResponse !== null ? rescanResponse.getRescannedThrough() : 0} />
              <span style={HomeStyles.rescanProgressFraction}>{rescanResponse !== null ? rescanResponse.getRescannedThrough():0}/{getAccountsResponse !== null ? getAccountsResponse.getCurrentBlockHeight():1}</span>
              <span style={HomeStyles.rescanProgressPercent}>{rescanPercFisnished}%</span>
            </div>
            }
            >
          </Header>:
          <Header
            headerTop={ !synced ?
                <div key="notSynced" style={HomeStyles.viewNotificationNotSynced}>
                  Wallet not synced. Note: Balances will not be accurate until syncing is complete.
                </div> :
                <div key="notSynced" ></div>
            }
            headerTitleOverview="Available Balance"
            headerMetaOverview={
              <div>
                <Balance amount={totalBalance} />
                <div style={HomeStyles.rescanButtonArea} data-tip="Rescanning the blockchain may resolve some balance errors.">
                  <KeyBlueButton onClick={() => this.props.rescanAttempt(0)}>Rescan</KeyBlueButton>
                </div>
              </div>
            }
          />
        }
        {getTransactionsRequestAttempt ?
          <div style={HomeStyles.content}>
            <div style={HomeStyles.contentTitle}>
              <div style={HomeStyles.contentTitleText}>Recent Transactions</div>
            </div>
            <div style={HomeStyles.contentNest}>
              {paginatedTxs.length > 0 || unmined.length > 0 ?
                <TxHistory getAccountsResponse={getAccountsResponse} mined={paginatedTxs} unmined={unmined}/>  :
                <p>{transactionMessage}</p>
              }
            </div>
          </div> :
          <div style={HomeStyles.content}>
            <StakeyBounce/>
          </div>
        }
      </div>);

    if (walletService === null) {
      return(<ErrorScreen />);
    } else {
      return(
        <div style={HomeStyles.body}>
          <SideBar />
          {homeView}
          <ReactToolTip place="left" type="info" effect="solid"/>
        </div>);
    }
  }
}

export default Home;


/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
