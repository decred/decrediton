import { Switch } from "react-router-dom";

export default ({ className, children }) => (
  <div className={className}>
    <div>
      <Switch>{children}</Switch>
    </div>
  </div>
);
