// @flow
import "style/Header.less";

const GetStarted = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  children
}) => (
  <div className="header-get-started">
    <div className="header-top-get-started">{headerTop}</div>
    <div className="header-title-overview-get-started">{headerTitleOverview}</div>
    <div className="header-meta-overview-get-started">{headerMetaOverview}</div>
    {children}
  </div>
);

export default GetStarted;
