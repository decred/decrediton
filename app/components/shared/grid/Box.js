import { createElement as h } from "react";
import cxs from "cxs/component";
import Tooltip from "../Tooltip";
import { showCheck } from "helpers";
import { number, string, array, oneOfType } from "prop-types";
import { width, space, fontSize, color, flex, responsiveStyle, propTypes } from "styled-system";

const Base = ({ is, ...props }) => h(is, props);
Base.defaultProps = { is: "div" };

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

BaseBox.propTypes = {
  ...propTypes.width,
  ...propTypes.space,
  ...propTypes.fontSize,
  ...propTypes.color,
  ...propTypes.flex,
  order: oneOfType([number, string, array])
};

BaseBox.displayName = "BaseBox";

const Box = ({ tooltip, ...props }) =>
  tooltip ?
  h(Tooltip, Object.assign({text: tooltip}, props)) :
  h(BaseBox, props);

export default showCheck(Box);
