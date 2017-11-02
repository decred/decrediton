import { shell } from "electron";
import "style/MiscComponents.less";

const HelpLink = ({ className, href, children }) => (
  <div className={"help-icon " + className} onClick={() => shell.openExternal(href)}>
    {children}
  </div>
);

export default HelpLink;
