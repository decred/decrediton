import { shell } from "electron";

const ExternalLink = ({ className, href, children }) => (
  <a className={className} onClick={() => shell.openExternal(href)} href="#">
    {children}
  </a>
);

export default ExternalLink;
