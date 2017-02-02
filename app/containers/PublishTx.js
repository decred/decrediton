import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class PublishTx extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {clearTransaction} = this.props;
    return (
	<div>
	<RaisedButton type="submit"
      onClick={()=>clearTransaction()}
      label="Clear Tx"
	/>
    </div>);
  }
}

export default PublishTx;

