// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import ErrorScreen from './ErrorScreen';
import TxRows from './TxRows';

class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, transactions } = this.props;
    const historyView = (
      <div>
        <h1>History Page</h1>
        <Table striped bordered condensed hover>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>TXID</TableHeaderColumn>
              <TableHeaderColumn>Amount</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(function(tx, i) {
            var parseDate = new Date(tx.transaction.mined_transactions.timestamp*1000);
              return (
                <TableRow key={i}>
                  <TableRowColumn>{tx.transaction.mined_transactions.height}</TableRowColumn>
                  <TableRowColumn>{tx.transaction.mined_transactions.transactions[0].hash.toString('hex')}</TableRowColumn>
                  <TableRowColumn><span>{parseDate.toString()}</span></TableRowColumn>
                </TableRow>);
            })}
          </TableBody>
        </Table>
      </div>);
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(historyView);
    }
  }
}

export default History;
