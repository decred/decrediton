import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

const PathButton = ({ disabled, onClick }) => (
  <Tooltip text={<T id="startup.dataDir.tip" m={"Select a path"} />}>
    <button
      aria-label="Select a path"
      className={"path-button"}
      {...{ disabled, onClick }}
    />
  </Tooltip>
);

export default PathButton;
