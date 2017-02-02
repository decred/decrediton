import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { rescanAttempt } from '../actions/ControlActions';
import ControlActions from '../actions/ControlActions';
import Button from '../components/ButtonTanel';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';

class RescanForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
    };
  }

  render() {
    let rescanHeightError = 'Rescan height must be 0 or a positive integer';

    // XXX specifying a block greater than the current block height
    // throws an error. need to add error display and also
    // maybe cache getAccountsResponse.getCurrentBlockHeight()
    // globally so it's accessible
    Formsy.addValidationRule('nonNegative', function (values, value) {
      return Number(value) > -1;
    });

    return (
      <div>
        <Formsy.Form
          id="rescanForm"
          name="rescanForm"
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={this.submitForm.bind(this)}
          onInvalidSubmit={this.notifyFormError.bind(this)}>
          <FormsyText
            id="startHeight"
            name="startHeight"
            validations="isInt,nonNegative"
            validationError={rescanHeightError}
            hintText="Starting Height for Rescan"
            floatingLabelText="Starting Height for Rescan"
            required
          />
          <br />
          <Button type="submit" disabled={!this.state.canSubmit}>Rescan Wallet</Button>
        </Formsy.Form>
      </div>
    );
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  submitForm() {
    var element = document.getElementById('startHeight');
    this.props.dispatch(rescanAttempt(parseInt(element.value)));
    element.value = '';
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions), dispatch);
}

export default connect(mapDispatchToProps)(RescanForm);
