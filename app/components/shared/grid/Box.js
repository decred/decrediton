import React from "react";
import { cxs } from "..";
import { number, string, array, oneOfType } from "prop-types";
import { width, space, fontSize, color, flex, responsiveStyle, propTypes } from "styled-system";

const Base = ({ is, ...props }) => {
  const Comp = (is || "div");
  return (<Comp { ...props }/>);
};

const order = responsiveStyle({ cssProperty: "order" });

const Box = cxs(Base)(
  { boxSizing: "border-box" },
  width,
  space,
  fontSize,
  color,
  flex,
  order,
);

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
