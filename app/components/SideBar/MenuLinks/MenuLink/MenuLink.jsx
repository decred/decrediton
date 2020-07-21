import { NavLink as Link } from "react-router-dom";
import style from "./MenuLink.module.css";
import { classNames } from "pi-ui";

const MenuLink = React.memo(
  React.forwardRef(({ path, link, icon, notifProp, sidebarOnBottom }, ref) => (
    <div ref={ref}>
      {notifProp ? (
        <span className={style.menuLinkNotificationIcon}></span>
      ) : null}
      <Link
        className={classNames(style.menuLink, style[icon + "Icon"])}
        activeClassName={style.menuLinkActive}
        icon={icon}
        to={path}
        key={path}
        data-testid={icon}>
        {!sidebarOnBottom && link}
      </Link>
    </div>
  ))
);

export default MenuLink;
