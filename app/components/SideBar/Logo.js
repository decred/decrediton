import { Icon } from "shared";

const Logo = ({ isTestNet }) => (
  <div className="sidebar-logo">
    <Icon i={ isTestNet ? "testnet" : "mainnet" } s={ 30 }/>
  </div>
);

export default Logo;
