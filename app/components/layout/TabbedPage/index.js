import { Switch, Route } from "react-router-dom";
import { isArray } from "util";
import { RoutedTabsHeader, RoutedTab } from "shared";

export const TabbedPageTab = ({children}) => children;
TabbedPageTab.propTypes = {
  path: PropTypes.string.isRequired,
  link: PropTypes.node.isRequired,
};

export default ({children, header}) => {
  if (!isArray(children)) children = [children];

  const tabs = children.filter(c => c.type === TabbedPageTab);
  const nonTabs = children.filter(c => c.type !== TabbedPageTab);

  const tabHeaders = tabs.map(c => (RoutedTab(c.props.path, c.props.link)));

  const headers = tabs.map(c =>
    <Route key={c.props.path} path={c.props.path} component={c.props.header} />
  );

  const tabBodies = tabs.map(c =>
    <Route key={c.props.path} path={c.props.path} component={c.props.component} />
  );

  return (
    <div className="tabbed-page">
      <div className="tabbed-page-header">
        {header}
        <Switch>{headers}</Switch>
        <RoutedTabsHeader tabs={tabHeaders} />
      </div>

      <div className="tabbed-page-body">
        <Switch>
          {tabBodies}
          {nonTabs}
        </Switch>
      </div>
    </div>
  );
};
