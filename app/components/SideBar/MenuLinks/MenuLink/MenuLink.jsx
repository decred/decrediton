import { NavLink as Link } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import style from "./MenuLink.module.css";
import { Tooltip, classNames } from "pi-ui";

const MenuLinkContent = ({
  path,
  link,
  icon,
  notifProp,
  sidebarOnBottom,
  expandSideBar
}) => (
  <>
    {notifProp ? (
      <span className={style.menuLinkNotificationIcon}></span>
    ) : null}
    <Link
      className={classNames(style.menuLink, style[icon + "Icon"])}
      activeClassName={classNames(style.menuLinkActive, style[icon + "Icon"])}
      icon={icon}
      to={path}
      key={path}>
      {!sidebarOnBottom && expandSideBar && link}
    </Link>
  </>
);

const MenuLink = React.memo(
  React.forwardRef(
<<<<<<< HEAD
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
=======
    ({ path, link, icon, notifProp, sidebarOnBottom, expandSideBar }, ref) => (
      <div ref={ref} className={style.menuLinkContainer}>
        {sidebarOnBottom || !expandSideBar ? (
          <Tooltip
            content={
              <T id="autobuyer.enabled" m="{value}" values={{ value: link }} />
            }
            contentClassName={
              sidebarOnBottom ? style.tooltipOnBottom : style.tooltipOnSide
            }>
            {notifProp ? (
              <span className={style.menuLinkNotificationIcon}></span>
            ) : null}
            <MenuLinkContent
              path={path}
              link={link}
              icon={icon}
              notifProp={notifProp}
              sidebarOnBottom={sidebarOnBottom}
              expandSideBar={expandSideBar}
            />
          </Tooltip>
        ) : (
          <MenuLinkContent
            path={path}
            link={link}
            icon={icon}
            notifProp={notifProp}
            sidebarOnBottom={sidebarOnBottom}
            expandSideBar={expandSideBar}
          />
        )}
>>>>>>> abad03da... Fix tooltips when sidebar is on bottom
      </div>
    )
  )
);

export default MenuLink;
