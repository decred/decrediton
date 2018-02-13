import NumericInput from "./NumericInput";
import { FormattedMessage as T } from "react-intl";

// BlocksInput is an input meant to read a block count
const BlocksInput = ({...props}) =>
  <NumericInput {
    ...{
      ...props,
      unit: (<T id="blocksInput.blocks" m="blocks" />)
    }
    } />;

export default BlocksInput;
