import { shell } from "electron";
import { network } from "connectors";
import { Button } from "pi-ui";

const clicker = (isTestNet, href, hrefTestNet) => () => {
  const url = hrefTestNet && isTestNet ? hrefTestNet : href;
  shell.openExternal(url);
};

const ExternalLink = ({ className, href, children, hrefTestNet, isTestNet }) => (
  <Button size="sm" className={className} onClick={clicker(isTestNet, href, hrefTestNet) } href="#">
    {children}
  </Button>
);

export default network(ExternalLink);
