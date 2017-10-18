// this is a demonstration of how cxs' component api is implemented
import { createElement as h } from "react";
import PropTypes from "prop-types";
import cxs from "cxs";

const cxsComponent = C => (...rules) => {
  const Comp = (props, context) => {
    const keysToStrip = Object.keys(Comp.propTypes || {});
    const styleProps = Object.assign({ theme: context.theme }, props);
    const next = {};
    for (let key in props) { if (!keysToStrip.includes(key)) next[key] = props[key]; }

    const applyRule = rule => typeof rule === "function" ? rule(styleProps) : rule;
    const classes = rules.map(applyRule).filter(rule => !!rule).map(rule => cxs(rule));
    next.className = [next.className, ...classes].join(" ").trim();

    return h(C, next);
  };
  Comp.contextTypes = { theme: PropTypes.func };

  return Comp;
};

export default cxsComponent;
