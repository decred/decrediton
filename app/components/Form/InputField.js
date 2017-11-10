import React from "react";
import "style/Input.less";

const inputField = ({
  input,
  placeholder,
  label,
  type,
  meta: { touched, error },
                     }) => (
    <div className="input-label-wrapper">
      <div className="message-form-group">
        <div className="message-label">
          {label}
        </div>
        <input {...input} placeholder={placeholder} type={type} />
      </div>
      {touched && (error && <div className="error-wrapper"><span className="input-error">{error}</span></div>)}
    </div>
  );

export default inputField;
