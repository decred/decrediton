import "style/MiscComponents.less";

// The children prop is meant to be used with inputs.
// "InlineField" refers to the fact that the label and children are meant to
// be seen inline to each other.
export default ({ label, children }) =>
  <div className="inline-field">
    <div className="inline-field-label">{label}</div>
    <div className="inline-field-field">{children}</div>
  </div>;
