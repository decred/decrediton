import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

const dataDirMessage = "Select a path";

const PathButton = ({ disabled, onClick }) => (

  <Tooltip text={<T id="startup.dataDir.tip" m={dataDirMessage} />}>
    <div
      className={"path-button"}
      {...{ disabled, onClick }}
    />
  </Tooltip>
);

export default PathButton;

