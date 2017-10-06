import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { Field, reduxForm } from "redux-form";
import InputField from "../Form/InputField";
import TextareaField from "../Form/TextareaField";
import ErrorField from "../Form/ErrorField";
import { validate } from "./validator";

const messages = defineMessages({
  addressFieldLabel: {
    id: "securitycenter.sign.form.field.address.label",
    defaultMessage: "Address:",
  },
  addressFieldPlaceholder: {
    id: "securitycenter.sign.form.field.address.placeholder",
    defaultMessage: "Enter your address here",
  },
  messageFieldLabel: {
    id: "securitycenter.sign.form.field.message.label",
    defaultMessage: "Message:",
  },
  messageFieldPlaceholder: {
    id: "securitycenter.sign.form.field.message.placeholder",
    defaultMessage: "Enter your message here",
  },
  passphraseFieldLabel: {
    id: "securitycenter.sign.form.field.passphrase.label",
    defaultMessage: "Passphrase:",
  },
  passphraseFieldPlaceholder: {
    id: "securitycenter.sign.form.field.passphrase.placeholder",
    defaultMessage: "Enter your passphrase here",
  },
});

const SignMessageForm = ({ handleSubmit, onSubmit, pristine, submitting, error, rpcError, formatMessage }) => {
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
          label={formatMessage(messages.addressFieldLabel)}
          name="address"
          component={InputField}
          type="text"
          placeholder={formatMessage(messages.addressFieldPlaceholder)}
        />
        <Field
          label={formatMessage(messages.messageFieldLabel)}
          name="message"
          component={TextareaField}
          placeholder={formatMessage(messages.messageFieldPlaceholder)}
        />
        <Field
          label={formatMessage(messages.passphraseFieldLabel)}
          name="passphrase"
          component={InputField}
          type="password"
          placeholder={formatMessage(messages.passphraseFieldPlaceholder)}
        />
        <div className="message-toolbar">
          <button className="key-blue-button" type="submit" disabled={pristine || submitting}>
            <T id="securitycenter.sign.form.submit" m="Sign" />
          </button>
        </div>
      </form>
    </div>
  );
};

SignMessageForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  formatMessage: PropTypes.func.isRequired,
  error: PropTypes.string,
  rpcError: PropTypes.string,
};

export default reduxForm({ form: "message/sign", validate })(SignMessageForm);
