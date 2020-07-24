import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";

const PathButton = ({ disabled, onClick }) => (
  <Tooltip content={<T id="startup.dataDir.tip" m={"Select a path"} />}>
    <div className={"path-button"} {...{ disabled, onClick }} />
  </Tooltip>
);

export default PathButton;
