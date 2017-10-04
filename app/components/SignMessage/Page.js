import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import InputField from "../Form/InputField";
import TextareaField from "../Form/TextareaField";
import ErrorField from "../Form/ErrorField";
import { validate } from "./validator";

const SignMessagePage = ({ handleSubmit, onSubmit, pristine, submitting, error, rpcError }) => {
  if (rpcError) {
    error = (
      <div className="error">{rpcError}</div>
    );
  }

  return (
    <div className="message-content-nest">
      <form onSubmit={handleSubmit(onSubmit)}>
        {error ? <div className="error">{error}</div> : null}
        <Field
          name="global"
          component={ErrorField}
        />
        <Field
          label="Address:"
          name="address"
          component={InputField}
          type="text"
          placeholder="Enter your address here"
        />
        <Field
          label="Message:"
          name="message"
          component={TextareaField}
          placeholder="Enter your message here"
        />
        <Field
          label="Passphrase:"
          name="passphrase"
          component={InputField}
          type="password"
          placeholder="Enter your passphrase here"
        />
        <div className="message-toolbar">
          <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
            Sign
          </button>
        </div>
      </form>
    </div>
  );
};

SignMessagePage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  rpcError: PropTypes.string,
};

export default reduxForm({ form: "message/sign", validate })(SignMessagePage);
