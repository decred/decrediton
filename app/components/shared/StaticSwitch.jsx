import { Switch } from "react-router-dom";

export default ({ className, children }) => (
  <div className={className}>
    <Switch>{children}</Switch>
  </div>
);
