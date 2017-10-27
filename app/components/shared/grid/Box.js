import { createElement as h } from "react";
import cxs from "cxs/component";
import Tooltip from "../Tooltip";
import { number, string, array, oneOfType } from "prop-types";
import { width, space, fontSize, color, flex, responsiveStyle, propTypes } from "styled-system";

const Base = ({ is, ...props }) => {
  const Comp = (is || "div");
  return (<Comp { ...props }/>);
};

const order = responsiveStyle({ cssProperty: "order" });

export const BaseBox = cxs(Base)(
  { boxSizing: "border-box" },
  width,
  space,
  fontSize,
  color,
  flex,
  order,
);

const Box = ({ tooltip, ...props }) =>
  tooltip ?
  h(Tooltip, Object.assign({text: tooltip}, props), h(BaseBox)) :
  h(BaseBox, props);

Box.displayName = "Box";

Box.propTypes = {
  ...propTypes.width,
  ...propTypes.space,
  ...propTypes.fontSize,
  ...propTypes.color,
  ...propTypes.flex,
  order: oneOfType([number, string, array])
};

export default Box;
