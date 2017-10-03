import React from "react";
import { Field, reduxForm } from "redux-form";
import InputField from "../Form/InputField";
import TextareaField from "../Form/TextareaField";

const validate = values => {
  const errors = {};
  if (!values.address) {
    errors.address = "Required";
  }
  if (!values.message) {
    errors.message = "Required";
  }
  if (!values.passphrase) {
    errors.passphrase = "Required";
  }

  return errors;
};


const SignMessagePage = ({ handleSubmit, onSubmit, pristine, submitting }) => (
  <div className="message-content-nest">
    <form onSubmit={handleSubmit(onSubmit)}>
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

export default reduxForm({ form: "message/sign", validate })(SignMessagePage);
