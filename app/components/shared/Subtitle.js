export default ({ title, children, className }) => (
  <div className={"tabbed-page-subtitle " + className}>
    {title}
    {children}
  </div>
);
