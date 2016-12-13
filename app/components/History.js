// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';

class History extends Component{
  static propTypes = {
    client: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };
  
  render() {
    const { client, isLoggedIn } = this.props;

    /* View that will be seen when user has a set Client */
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
            <TableRow>
              <TableRowColumn>20:20:20 November 28th 2016</TableRowColumn>
              <TableRowColumn>txid</TableRowColumn>
              <TableRowColumn>200</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>20:20:20 November 28th 2016</TableRowColumn>
              <TableRowColumn>txid</TableRowColumn>
              <TableRowColumn>200</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>20:20:20 November 28th 2016</TableRowColumn>
              <TableRowColumn>txid</TableRowColumn>
              <TableRowColumn>200</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>);

    /* Check to see that client is not undefined */
    if (isLoggedIn) {
      if (client === undefined) {
        <p>Error occurred, should have client available</p>
      } else {
        return(historyView);
      }
    } else {
      return(
        <div>
          <p>Error occurred, should be logged in</p>
        </div>
      );
    }
  }
};

export default History;
