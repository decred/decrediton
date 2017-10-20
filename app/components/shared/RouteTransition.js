import { createElement as h } from "react";
import { spring, TransitionMotion } from "react-motion";
import { object, string, func, bool } from "prop-types";

const e = (styles, o) => (
  Object.keys(styles).reduce((acc, key) => {
    const value = styles[key];
    acc[key] = typeof value === "number" ? spring(value, o) : value;
    return acc;
  }, {})
);

const RT = props => {
  const base = { data: props.children, key: props.pathname };
  const defaultStyles =
    !props.runOnMount ? null :
    !props.children ? [] :
    [{...base, style: props.atEnter }];

  const styles =
    !props.children ? [] :
    [{...base, style: e(props.atActive, props.opts) }];

  const willEnter = () => props.atEnter;
  const willLeave = () => e(props.atLeave, props.opts);
  const tmProps = { willEnter, willLeave, defaultStyles, styles };
  const route = ({ key, style, data }) => {
    const routeProps = {...{key}, style: props.mapStyles(style) }; return h("div", routeProps, data);
  };
  const routes = routes => h("div", null, routes.map(route));
  return h(TransitionMotion, tmProps, routes);
};

RT.defaultProps = {
  runOnMount: true,
  mapStyles: val => val,
  opts: { stiffness: 40, damping: 26 }
};

RT.propTypes = {
  atEnter: object.isRequired,
  atActive: object.isRequired,
  atLeave: object.isRequired,
  pathname: string.isRequired,
  mapStyles: func,
  runOnMount: bool,
  opts: object
};

export default RT;
