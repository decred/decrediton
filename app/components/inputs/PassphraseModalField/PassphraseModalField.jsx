import style from "./PassphraseModalField.module.css";

export default ({ label, children }) => (
  <div className={style.passphraseModalField}>
    <label>
      <span>{label}:</span>
      <div className={style.field}>{children}</div>
    </label>
  </div>
);
