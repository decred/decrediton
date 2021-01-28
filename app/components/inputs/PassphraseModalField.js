export default ({ label, children, id }) => (
  <div className="passphrase-modal-field">
    <label id={id} className="passphrase-modal-field-label">
      {label}:
    </label>
    <div className="passphrase-modal-field-value">{children}</div>
  </div>
);
