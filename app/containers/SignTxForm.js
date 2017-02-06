import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

class SignTxForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      privpass: '',
      rawTx: props.rawTx,
    };
  }

  render() {

    const {signTransactionAttempt, clearTransaction} = this.props;
    return (
    <div>
      <form id="signTxForm" onSubmit={e => {
        e.preventDefault();
        if (this.state.privpass == '') {
          return;
        }
        signTransactionAttempt(this.state.privpass, this.state.rawTx);
        document.getElementById('signTxForm').reset();
        this.state.privpass.fill(0);
        document.getElementById('privpass').value = '';
        this.state.privpass = '';
      }}>
        <TextField
          id="privpass"
          hintText="Private Password"
          floatingLabelText="Private Password"
          onBlur={(e) =>{this.setState({privpass: Buffer.from(e.target.value)});}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Confirm and Sign Tx'/>
      </form>
        <RaisedButton type="submit"
          onClick={()=>clearTransaction()}
          label="Clear Tx"
      />
    </div>);
  }
}

export default SignTxForm;
