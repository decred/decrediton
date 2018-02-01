import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

const dataDirMessage = "Select a data directory";

const DirectoryButton = ({ disabled, onClick }) => (
  <Tooltip text={<T id="startup.dataDir.tip" m={dataDirMessage} />}>
    <div
      className={"directory-button"}
      {...{ disabled, onClick }}
    />
  </Tooltip>
);

export default DirectoryButton;

