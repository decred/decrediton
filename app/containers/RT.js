import { createElement as h } from 'react';
import { spring, TransitionMotion as TM } from 'react-motion';
import PropTypes from 'prop-types';

const ensureSpring = (styles, opts) =>
  Object.keys(styles).reduce((a, b) => {
    const v = styles[b];
    a[b] = typeof v === "number" ? spring(v, opts) : v;
    return a
  }, {});

const RouteTransition = p => {
  const base = { data: p.children, key: p.pathname }
  const getDefaultStyles = () => {
    if (!p.runOnMount) return null;
    if (!p.children) return [];
    return [{...base, style: p.atEnter }];
  }
  const getStyles = () => {
    if (!p.children) return [];
    return [{...base, style: ensureSpring(p.atActive, p.opts) }];
  }
  const willEnter = () => p.atEnter;
  const willLeave = () => ensureSpring(p.atLeave, p.opts);
  const defaultStyles = getDefaultStyles();
  const styles = getStyles();
  const tmProps = { willEnter, willLeave, defaultStyles, styles };
  const routeRenderer = ({ key, style, data }) => h("div", {...{key, style}}, data)
  const routesRenderer = routes => h("div", null, routes.map(routeRenderer))
  return h(TM, tmProps, routesRenderer)
}

RouteTransition.defaultProps = {
  runOnMount: true,
  mapStyles: val => val,
  opts: { stiffness: 120, damping: 26 }
};

RouteTransition.propTypes = {
  atEnter: PropTypes.object.isRequired,
  atActive: PropTypes.object.isRequired,
  atLeave: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  mapStyles: PropTypes.func,
  runOnMount: PropTypes.bool,
  opts: PropTypes.object
};

export default RouteTransition;
