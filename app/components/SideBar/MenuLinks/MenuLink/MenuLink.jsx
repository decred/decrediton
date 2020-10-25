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
  ariaLabel,
  expandSideBar
}) => (
  <>
    {notifProp && (
      <span
        className={style.menuLinkNotificationIcon}
        data-testid="menu-link-notification-icon"></span>
    )}
    <Link
      className={classNames(style.menuLink, style[icon + "Icon"])}
      activeClassName={classNames(style.menuLinkActive, style[icon + "Icon"])}
      icon={icon}
      to={path}
      key={path}
      aria-label={ariaLabel}>
      {!sidebarOnBottom && expandSideBar && link}
    </Link>
  </>
);

const MenuLink = React.memo(
  React.forwardRef(
    (
      {
        path,
        link,
        icon,
        notifProp,
        sidebarOnBottom,
        ariaLabel,
        expandSideBar
      },
      ref
    ) => (
      <div ref={ref} className={style.menuLinkContainer}>
        {sidebarOnBottom || !expandSideBar ? (
          <Tooltip
            content={
              <T
                id="sidebar.menuLinkTooltip"
                m="{value}"
                values={{ value: link }}
              />
            }
            contentClassName={
              sidebarOnBottom ? style.tooltipOnBottom : style.tooltipOnSide
            }>
            <MenuLinkContent
              path={path}
              link={link}
              icon={icon}
              notifProp={notifProp}
              sidebarOnBottom={sidebarOnBottom}
              ariaLabel={ariaLabel}
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
            ariaLabel={ariaLabel}
            expandSideBar={expandSideBar}
          />
        )}
      </div>
    )
  )
);

export default MenuLink;
