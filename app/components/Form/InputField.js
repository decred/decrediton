import React from "react";

const inputField = ({
  input,
  placeholder,
  label,
  type,
  meta: { touched, error },
                     }) => (
    <div className="message-form-group">
      <div className="message-label">
        {label}
      </div>
      <input {...input} placeholder={placeholder} type={type} />
      {touched && (error && <div className="error-wrapper"><span className="error input-error">{error}</span></div>)}
    </div>
  );

export default inputField;
