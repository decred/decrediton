import { React, createElement as h  } from "react";
import { Motion } from "react-motion";

const MotionWrapper = ({
  defaultStyle,
  style,
  data,
  ...props
}) => {
  const tmProps = { defaultStyle, style };
  const child = (interpolatedStyle) => {
    const childProps = { style: interpolatedStyle };
    return props.wrapperComponent ?
      h(props.wrapperComponent, childProps, data) :
      React.cloneElement(props.wrapperComponent, childProps);
  };
  return h(Motion, tmProps, child);

  // const tmProps = { willEnter, willLeave, defaultStyles, styles };
  // const child = ({ key, style, data }) => {
  //   const childProps = { ...{ key }, style: props.mapStyles(style) };
  //   return props.wrapperComponent ?
  //     h(props.wrapperComponent, childProps, data) :
  //     React.cloneElement(data, childProps);
  // };
  // const children = children => h("div", { className: props.className }, children.map(child));
  // return h(TransitionMotion, tmProps, children);
};

export default MotionWrapper;
