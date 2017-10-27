import { createElement as h } from "react";
import { spring, TransitionMotion } from "react-motion";
import { object, string, func, bool, oneOfType } from "prop-types";

const ensureSpring = (styles, options) => (
  Object.keys(styles).reduce((acc, key) => {
    const value = styles[key];
    acc[key] = typeof value === "number" ? spring(value, options) : value;
    return acc;
  }, {})
);

const RouteTransition = props => {
  const base = { data: props.children, key: props.pathname };
  const defaultStyles =
    !props.runOnMount ? null :
    !props.children ? [] :
    [{...base, style: props.atEnter }];

  const styles =
    !props.children ? [] :
    [{...base, style: ensureSpring(props.atActive, props.opts) }];

  const willEnter = () => props.atEnter;
  const willLeave = () => ensureSpring(props.atLeave, props.opts);
  const tmProps = { willEnter, willLeave, defaultStyles, styles };
  const route = ({ key, style, data }) => {
    const routeProps = {...{key}, style: props.mapStyles(style) };
    return h(props.wrapperComponent, routeProps, data);
  };
  const routes = routes => h("div", { className: props.className }, routes.map(route));
  return h(TransitionMotion, tmProps, routes);
};

RouteTransition.defaultProps = {
  wrapperComponent: "div",
  runOnMount: true,
  mapStyles: val => val,
  opts: { stiffness: 40, damping: 26 }
};

RouteTransition.propTypes = {
  wrapperComponent: oneOfType([string, func]),
  atEnter: object.isRequired,
  atActive: object.isRequired,
  atLeave: object.isRequired,
  pathname: string.isRequired,
  mapStyles: func,
  runOnMount: bool,
  className: string,
  opts: object
};

export default RouteTransition;
