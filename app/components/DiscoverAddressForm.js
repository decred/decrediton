import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { discoverAddressAttempt } from '../actions/WalletLoaderActions';
import ControlActions from '../actions/ControlActions';
import Button from '../components/ButtonTanel';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';

class DiscoverAddressForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
    };
  }

  render() {
    let privatePasswordError = 'Private password must not be empty';

    return (
      <div>
        <Formsy.Form
          id="discoverAddressForm"
          name="discoverAddressForm"
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={this.submitForm.bind(this)}
          onInvalidSubmit={this.notifyFormError.bind(this)}>
          <FormsyText
            type="password"
            id="privpass"
            name="privpass"
            validations="isExisty"
            validationError={privatePasswordError}
            hintText="Private Password"
            floatingLabelText="Private Password"
            required
          />
          <br />
          <Button type="submit" disabled={!this.state.canSubmit}>Discover Addresses</Button>
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
    var element = document.getElementById('privpass');
    this.props.dispatch(discoverAddressAttempt(true,Buffer.from(element.value)));
    element.value = '';
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions), dispatch);
}

export default connect(mapDispatchToProps)(DiscoverAddressForm);
