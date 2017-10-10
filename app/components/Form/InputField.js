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
    {touched && (error && <span className="error">{error}</span>)}
  </div>
);

export default inputField;
