import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import { reverseHash } from '../helpers/byteActions';

const styles = {
  topBar: {
    position: 'absolute',
    top:'0px',
    right: '0px',
    left:'0px',
    height: '70px',
    backgroundColor: '#132f4b',
    color: 'white',
  },
  title: {
    marginTop: '23px',
    marginLeft: '20px',
    position: 'absolute',
    fontSize: '1.5em',
  },
};

class TxHistory extends Component {
  render() {
    const transactions = this.props.transactions;
    return (
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
      </Table>);
  }
}

export default TxHistory; 
