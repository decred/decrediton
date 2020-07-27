import { NavLink as Link } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import style from "./MenuLink.module.css";
import { Tooltip, classNames } from "pi-ui";

const MenuLink = React.memo(
  React.forwardRef(
    ({ path, link, icon, notifProp, ariaLabel, sidebarOnBottom, expandSideBar }, ref) => (
      <div ref={ref}>
        {notifProp ? (
          <span className={style.menuLinkNotificationIcon}></span>
        ) : null}
        <Link
          className={classNames(style.menuLink, style[icon + "Icon"])}
          activeClassName={classNames(
            style.menuLinkActive,
            style[icon + "Icon"]
          )}
          icon={icon}
          to={path}
          key={path}
          aria-label={ariaLabel}>
          {!sidebarOnBottom && expandSideBar && link}
        </Link>
      </div>
    )
  )
);

export default MenuLink;
