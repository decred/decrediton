import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { constructTransactionAttempt } from '../actions/ControlActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { bindActionCreators } from 'redux';
import ControlActions from '../actions/ControlActions';

const style = {
  margin: 12,
};

class ConstructTxForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { 
          account: '',
          confirmations: '',
          outputs: [{key:0, destination: '', amount: ''}] };
        
    }

    render() {
        return(
            <div>
              <form 
                onSubmit={e => {
	                e.preventDefault();
	                if (this.account == '' || this.confirmations == '' ) {
	                  return;
	                }
                  this.props.dispatch(constructTransactionAttempt(this.state.account, this.state.confirmations, this.state.outputs));
	              }}>
                <div id="dynamicInput">
                  {this.state.outputs.map(output => {
                    return(
                      <div key={output.key}>
                        <p key={"label"+output.key}>{output.key}</p>
	                      <TextField
                          key={"destination"+output.key}
                          hintText="Destination Address"
                          floatingLabelText="Destination Address"
                          onBlur={(e) =>{this.updateOutputDestination(output.key, e.target.value)}}/>
                        <TextField
                          key={"amount"+output.key}
                          hintText="Amount"
                          floatingLabelText="Amount"
                          onBlur={(e) =>{this.updateOutputAmount(output.key, e.target.value)}}/>
                      </div>
                    )})
                  }
                </div>
                <RaisedButton 
                  onClick={() => this.appendOutput()}
                  style={style}
                  label='Add another destination'/>
                <TextField
                  id="account"
                  hintText="Account Number"
                  floatingLabelText="Account Number"
                  onBlur={(e) =>{this.setState({account: e.target.value})}}
                /><br />
	              <TextField
                  id="confirmations"
                  hintText="# of Confirmations"
                  floatingLabelText="# of Confirmations"
                  onBlur={(e) =>{this.setState({confirmations: e.target.value})}}
                /><br />
	              <RaisedButton type="submit"
                  style={style}
                  label='Send'/>
              </form>
            </div>
        );
    }

    appendOutput() {
        var newOutput = {key:`${this.state.outputs.length}`, destination: '', amount: ''};
        this.setState({ outputs: this.state.outputs.concat([newOutput]) });
    }
    appendRemoveOutput() {
        var newOutput = {key:`output-${this.state.outputs.length}`, destination: '', amount: ''};
        this.setState({ outputs: this.state.outputs.concat([newOutput]) });
    }
    updateOutputDestination(outputKey, dest) {
      console.log("updateOutputDest", outputKey, dest);
      var updateOutputs = this.state.outputs;
      updateOutputs[outputKey].destination = dest;
      this.setState({ outputs: updateOutputs });
    }
    updateOutputAmount(outputKey, amount) {
      console.log("updateOutputAmount", outputKey, amount);
      var updateOutputs = this.state.outputs;
      updateOutputs[outputKey].amount = amount;
      this.setState({ outputs: updateOutputs });
    }
    /*
  return (
    <div>
        <div id="dynamicInput">
        {outputs.map(function(output) {
          console.log(outputs.length);
          return (
            <div>
	            <TextField
                key='destination+${output.key}'
                hintText="Destination Address"
                floatingLabelText="Destination Address"
                onBlur={(e) =>{outputs[output.key].destination = e.target.value;}}/>
              <TextField
                key='amount+${output.key}'
                hintText="Amount"
                floatingLabelText="Amount"
                onBlur={(e) =>{outputs[output.key].amount = e.target.value;}}/>
            </div>);
          }
        )}
        </div>
        <br />
        <RaisedButton 
          onClick={() => {addOutput()}}
          style={style}
          label='Add another destination'/>
        <br />
	      <TextField
          id="account"
          hintText="Account Number"
          floatingLabelText="Account Number"
          onBlur={(e) =>{account = e.target.value;}}
        /><br />
      <TextField
          id="confirmations"
          hintText="# of Confirmations"
          floatingLabelText="# of Confirmations"
          onBlur={(e) =>{confirmations = e.target.value;}}
        /><br />
      <RaisedButton type="submit"
          style={style}
          label='Send'/>
	    </form>
	</div>);
  */
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions), dispatch);
}

export default connect(mapDispatchToProps)(ConstructTxForm);
