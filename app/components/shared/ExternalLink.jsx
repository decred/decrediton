import { shell } from "electron";
import { useNetwork } from "hooks";

const clicker = (isTestNet, href, hrefTestNet) => () => {
  const url = hrefTestNet && isTestNet ? hrefTestNet : href;
  shell.openExternal(url);
};

const ExternalLink = ({ className, href, children, hrefTestNet }) => {
  const { isTestNet } = useNetwork();
  return (
    <a
      className={className}
      onClick={clicker(isTestNet, href, hrefTestNet)}
      href="#">
      {children}
    </a>
  );
};

export default ExternalLink;
