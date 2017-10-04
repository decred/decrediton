import React from "react";

const ErrorField = ({ meta: { error } }) => {
  if (!error) {
    return null;
  }
  return <div className="error">{error}</div>;
};

export default ErrorField;
