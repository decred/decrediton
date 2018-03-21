const Logo = ({ isTestNet, expandSideBar, onReduceSideBar, onExpandSideBar  }) => (
  <div className="sidebar-logo" onClick={!expandSideBar ? onExpandSideBar : null}>
    <div className={!expandSideBar ? "hamburger" : isTestNet ? "testnet" : "mainnet"} />
    {expandSideBar &&
      <div className="sidebar-reduce-arrow" onClick={expandSideBar ? onReduceSideBar : null}>
      </div>
    }
  </div>
);

export default Logo;
