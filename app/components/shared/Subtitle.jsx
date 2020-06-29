import { classNames } from "pi-ui";

export default ({ title, children, className }) => (
  <div className={classNames("tabbed-page-subtitle", className)}>
    {title}
    {children}
  </div>
);
