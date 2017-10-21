import { createElement as h } from "react";
import { spring, TransitionMotion } from "react-motion";
import { object, string, func, bool } from "prop-types";

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
    return h("div", routeProps, data);
  };
  const routes = routes => h("div", null, routes.map(route));
  return h(TransitionMotion, tmProps, routes);
};

RouteTransition.defaultProps = {
  runOnMount: true,
  mapStyles: val => val,
  opts: { stiffness: 40, damping: 26 }
};

RouteTransition.propTypes = {
  atEnter: object.isRequired,
  atActive: object.isRequired,
  atLeave: object.isRequired,
  pathname: string.isRequired,
  mapStyles: func,
  runOnMount: bool,
  opts: object
};

export default RouteTransition;
