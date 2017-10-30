import cxs from "cxs/component";
import { Box } from "shared";
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
