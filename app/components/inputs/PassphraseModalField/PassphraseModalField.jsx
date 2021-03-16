import style from "./PassphraseModalField.module.css";

export default ({ label, children }) => (
  <div className={style.passphraseModalField}>
    <label>
      <span className={style.labelSpan}>{label}:</span>
      <div className={style.field}>{children}</div>
    </label>
  </div>
);
