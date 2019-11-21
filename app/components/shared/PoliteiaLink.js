import ExternalLink from "./ExternalLink";

export default ({ children, path, className }) => (
  <ExternalLink
    href={"https://proposals.decred.org" + (path||"")}
    hrefTestNet={"https://test-proposals.decred.org" + (path||"")}
    className={className}
  >
    {children}
  </ExternalLink>
);
