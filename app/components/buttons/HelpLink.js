import { shell } from "electron";
import "style/MiscComponents.less";

const HelpLink = ({ className, onClick, href, title, subtitle, expand }) => (
  <div className={"help-icon " + className} onClick={onClick ? onClick : () => shell.openExternal(href)}>
    <div className="help-icon-text">
      <div className="help-icon-title">{title}</div>
      <div className="help-icon-subtitle">{subtitle}</div>
    </div>
    {expand ? <div className="help-icon-link-expand"/> : <div className="help-icon-link-external"/> }
  </div>
);

export default HelpLink;
