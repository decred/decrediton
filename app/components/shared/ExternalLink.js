import { shell } from "electron";
import { network } from "connectors";
import { Button } from "pi-ui";

const clicker = (isTestNet, href, hrefTestNet) => () => {
  const url = hrefTestNet && isTestNet ? hrefTestNet : href;
  shell.openExternal(url);
};

const ExternalLink = ({ className, href, children, hrefTestNet, isTestNet, isButton }) => (
  isButton ? (
    <Button size="sm" className={className} onClick={clicker(isTestNet, href, hrefTestNet) } href="#">
      {children}
    </Button>) :
    (<a className={className} onClick={clicker(isTestNet, href, hrefTestNet) } href="#">
      {children}
    </a>)
);

export default network(ExternalLink);
