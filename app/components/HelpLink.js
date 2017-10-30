import { shell } from "electron";
import "style/MiscComponents.less";

const HelpLink = ({ className, href, children }) => (
  <Aux>
    <div className={"help-icon " + className} onClick={() => shell.openExternal(href)}>
      {children}
    </div>
  </Aux>
);

export default HelpLink;
