import ExternalLink from "./ExternalLink";

export default ({ children, path, className, isButton }) => (
  <ExternalLink
    href={"https://proposals.decred.org" + (path||"")}
    hrefTestNet={"https://test-proposals.decred.org" + (path||"")}
    className={className}
    isButton={isButton}
  >
    {children}
  </ExternalLink>
);
