import { Icon } from "shared";

const Logo = ({ isTestNet }) => (
  isTestNet ?
  <div className="sidebar-testnet-logo">
    <Icon i="testnet" s={ 30 }/>
  </div> :
  <div className="sidebar-mainnet-logo"/>
);

export default Logo;
