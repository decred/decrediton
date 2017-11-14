import React from "react";
import {Input} from "inputs";

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
    <Input {...input} placeholder={placeholder} type={type} />
    {touched && (error && <span className="error">{error}</span>)}
  </div>
);

export default inputField;
