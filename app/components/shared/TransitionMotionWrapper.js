import { cloneElement as k, createElement as h } from "react";
import { TransitionMotion } from "react-motion";
import { isFunction } from "util";
import { useTheming } from "hooks";

const TransitionMotionWrapper = ({
  willEnter,
  willLeave,
  defaultStyles,
  styles,
  ...props
}) => {
  const { uiAnimations } = useTheming();
  const tmProps = { willEnter, willLeave, defaultStyles, styles };
  const child = ({ key, style, data }) => {
    const childProps = { ...{ key }, style: props.mapStyles(style) };
    return props.wrapperComponent
      ? h(props.wrapperComponent, childProps, data)
      : h("div", childProps, k(data));
  };
  const children = (children) =>
    h("div", { className: props.className }, children.map(child));
  if (!uiAnimations) {
    const actual = isFunction(styles) ? styles(props) : styles;
    return h("div", {}, children(actual));
  }

  return h(TransitionMotion, tmProps, children);
};

TransitionMotionWrapper.defaultProps = {
  mapStyles: (val) => val
};

export default TransitionMotionWrapper;
