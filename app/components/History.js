// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import ErrorScreen from './ErrorScreen';
import { reverseHash } from '../helpers/byteActions'
class History extends Component{
  static propTypes = {
    walletService: PropTypes.object,
  };

  render() {
    const { walletService, transactions } = this.props;

    const historyView = (
      <div>
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
            var parseDate = new Date(tx.transaction.mined_transactions.timestamp*1000);
              var s = tx.transaction.mined_transactions.transactions[0].hash.toString('hex')
              var reversed = reverseHash(s)
              return (
                <TableRow key={i}>
                  <TableRowColumn>{tx.transaction.mined_transactions.height}</TableRowColumn>
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
      return(historyView);
    }
  }
}

export default History;
