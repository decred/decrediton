import ExternalLink from "./ExternalLink";

export default ({ children, path }) => (
  <ExternalLink
    href={"https://proposals.decred.org" + (path||"")}
    hrefTestNet={"https://test-proposals.decred.org" + (path||"")}
  >
    {children}
  </ExternalLink>
);
