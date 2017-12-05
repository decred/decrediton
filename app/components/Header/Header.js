// @flow
import "style/Header.less";

const Header = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  children
}) => (
  <div className="header">
    <div className="header-top">{headerTop}</div>
    <div className="header-title-overview">{headerTitleOverview}</div>
    <div className="header-meta-overview">{headerMetaOverview}</div>
    {children}
  </div>
);

export default Header;
