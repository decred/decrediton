export const Column = ({ label, value }) =>
  <div className="stakepool-stake-info-column">
    <span className="stakepool-stake-info-label">{label}{label ? ":" : ""}</span>
    <span className="stakepool-stake-info-value">{value}</span>
  </div>;