export const Row = ({ children }) =>
  <div className="stakepool-stake-info-row">
    {children}
  </div>;

export const Column = ({ label, value }) =>
  <div className="stakepool-stake-info-column">
    <span className="stakepool-stake-info-label">{label}{label ? ":" : ""}</span>
    <span className="stakepool-stake-info-value">{value}</span>
  </div>;

export const LastRow = ({ children }) =>
  <div className="stakepool-stake-info-row-last">
    {children}
  </div>;
