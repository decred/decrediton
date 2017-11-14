const Logo = ({ isTestNet }) => (
  <div className="sidebar-logo">
    <div className={isTestNet ? "testnet" : "mainnet"} />
  </div>
);

export default Logo;
