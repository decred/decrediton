import { cloneElement as k, createElement as h } from "react";
import { TransitionMotion } from "react-motion";
import { theming } from "connectors";
import { isFunction } from "util";

const TransitionMotionWrapper = ({
  willEnter,
  willLeave,
  defaultStyles,
  styles,
  uiAnimations,
  ...props
}) => {
  const tmProps = { willEnter, willLeave, defaultStyles, styles };
  const child = ({ key, style, data }) => {
    const childProps = { ...{ key }, style: props.mapStyles(style) };
    return props.wrapperComponent ?
      h(props.wrapperComponent, childProps, data) :
      h("div", childProps, k(data));
  };
  const children = children => h("div", { className: props.className }, children.map(child));
  if (!uiAnimations) {
    const actual = isFunction(styles) ? styles(props) : styles;
    return h(Aux, {}, children(actual));
  }

  return h(TransitionMotion, tmProps, children);
};

TransitionMotionWrapper.defaultProps = {
  mapStyles: val => val,
};

export default theming(TransitionMotionWrapper);
