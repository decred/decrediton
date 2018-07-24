import { routing } from "connectors";
import InvisibleButton from "./InvisibleButton";

const GoBackIconButton = ({ goBackHistory }) => (
  <InvisibleButton className="go-back-icon-button" onClick={goBackHistory} />
);

export default routing(GoBackIconButton);
