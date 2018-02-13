import { Switch, Route, NavLink as Link } from "react-router-dom";
import { isArray } from "util";

export const TabbedPageTab = ({children}) => children;

export default ({children, header}) => {
  if (!isArray(children)) children = [children];

  const tabs = children.filter(c => c.type === TabbedPageTab);
  const nonTabs = children.filter(c => c.type !== TabbedPageTab);

  const headers = tabs.map(c =>
    <Route key={c.props.path} path={c.props.path} component={c.props.header} />
  );

  const tabLinks = tabs.map(c =>
    <Link key={c.props.path} to={c.props.path}>{c.props.link}</Link>
  );

  const tabBodies = tabs.map(c =>
    <Route key={c.props.path} path={c.props.path} component={c.props.component} />
  );

  return (
    <div>
      <div className="header">
        {header}

        <Switch>{headers}</Switch>

        <div>{tabLinks}</div>
      </div>

      <div className="body">
        <Switch>
          {tabBodies}
          {nonTabs}
        </Switch>
      </div>
    </div>
  );
};
