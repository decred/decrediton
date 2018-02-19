export default ({ label, children }) =>
  <div className="passphrase-modal-field">
    <div className="passphrase-modal-field-label">{label}:</div>
    <div className="passphrase-modal-field-value">{children}</div>
  </div>;
