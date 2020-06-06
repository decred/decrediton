import { NavLink as Link } from "react-router-dom";
import style from "./SideBar.module.css"
import { classNames } from "pi-ui";

const MenuLink = ({ icon, linkRef, hasNotification, ...props }) => (
  <div ref={linkRef}>
    {hasNotification ? (
      <span className={style.sidebarMenuLinkNotificationIcon}></span>
    ) : null}
    <Link
      className={classNames(style.menuLink, style[icon + "Icon"])}
      activeClassName={classNames(style.menuLinkActive, style[icon + "Icon"])}
      {...props}
    />
  </div>
);

export default MenuLink;
