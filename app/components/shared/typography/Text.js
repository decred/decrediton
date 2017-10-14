import React from "react";
import { Box } from "shared";
import cxs from "cxs/component";
import PropTypes from "prop-types";
import { textAlign, fontWeight, propTypes } from "styled-system";

const caps = ({ caps }) => caps ? { textTransform: "uppercase" } : null;

const Text = cxs(props => (
  <Box is="p" { ...props } />
))(textAlign, fontWeight, caps);

Text.propTypes = {
  caps: PropTypes.bool,
  ...propTypes.textAlign,
  ...propTypes.fontWeight
};

export default Text;
