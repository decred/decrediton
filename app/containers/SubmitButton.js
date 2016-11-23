import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

const SubmitButton = ({ user }) =>
  <button type="submit">
    Connect to Wallet
  </button>;

SubmitButton.propTypes = {
  user: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = (state) => {
    return { user: state.user }; 
};

export default connect(mapStateToProps)(SubmitButton);
