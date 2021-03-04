import style from "./InlineField.module.css";

// The children prop is meant to be used with inputs.
// "InlineField" refers to the fact that the label and children are meant to
// be seen inline to each other.
export default ({ label, children }) => (
  <div className={style.inlineField}>
    <label>
      {label}
      <div className={style.field}>{children}</div>
    </label>
  </div>
);
