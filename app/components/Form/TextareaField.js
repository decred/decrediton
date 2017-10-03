import React from "react";

const textareaField = ({
                         input,
                         placeholder,
                         label,
                         meta: { touched, error },
                       }) => (
  <div className="message-form-group">
    <div className="message-label">
      {label}
    </div>
    <textarea {...input} placeholder={placeholder} />
    {touched && (error && <span className="error">{error}</span>)}
  </div>
);

export default textareaField;
