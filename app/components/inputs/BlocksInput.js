import FloatInput from "./FloatInput";
import { FormattedMessage as T } from "react-intl";

// BlocksInput is an input meant to read a block count
const BlocksInput = ({ ...props }) =>
  <FloatInput {
    ...{
      ...props,
      unit: (<T id="blocksInput.blocks" m="blocks" />)
    }
    } />;

export default BlocksInput;
