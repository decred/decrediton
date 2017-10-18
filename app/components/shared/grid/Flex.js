import Box from "./Box";
import { cxs } from "..";
import PropTypes from "prop-types";
import { flexWrap, flexDirection, alignItems, justifyContent, propTypes } from "styled-system";

const column = props => props.column ? "flex-direction:column;" : null;

const Flex = cxs(Box)(
  { display: "flex" },
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
  column,
);

Flex.displayName = "Flex";

Flex.propTypes = {
  ...propTypes.flexWrap,
  ...propTypes.flexDirection,
  ...propTypes.alignItems,
  ...propTypes.justifyContent,
  column: PropTypes.bool,
};

export default Flex;
