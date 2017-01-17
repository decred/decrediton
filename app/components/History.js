// @flow
import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import ErrorScreen from './ErrorScreen';
import { reverseHash } from '../helpers/byteActions';
import SideBar from './SideBar';
import Header from './Header';

const styles = {
  body: {
    height: '100%'
  },
  pageWrap: {
    minHeight: '100%',
    /* equal to footer height */
    marginBottom: '-142px',


    ':after': {
      content: '',
      display: 'block',
    },
  },
  header: {
    border:'1px solid #000',
    width:'100px',
    height:'20px',
    margin:'0 0 5px 0',
  },
  content: {
    position: 'absolute',
    top: '78px',
    left: '202px',
    bottom: '0px',
    right: '0px',
  },
};

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, transactions } = this.props;

    const historyView = (
      <div style={styles.content}>
        <h1>History Page</h1>
        <Table fixedHeader={true} striped bordered condensed hover showCheckboxes={false} >
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Block Number</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Transaction Hash</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {transactions.map(function(tx, i) {
              var parseDate = new Date(tx.transaction.getMinedTransactions().getTimestamp()*1000);
              var s = Buffer.from(tx.transaction.getMinedTransactions().getTransactionsList()[0].getHash()).toString('hex');
              var reversed = reverseHash(s);
              return (
                <TableRow key={i}>
                  <TableRowColumn>{tx.transaction.getMinedTransactions().getHeight()}</TableRowColumn>
                  <TableRowColumn><span>{parseDate.toString()}</span></TableRowColumn>
                  <TableRowColumn colSpan={3}>{reversed}</TableRowColumn>
                </TableRow>);
            })}
          </TableBody>
        </Table>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <Header />
          <SideBar />
          {historyView}
        </div>);
    }
  }
}

export default History;
