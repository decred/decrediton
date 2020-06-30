import { daemonStartup, settings } from "connectors"; // hooks instead of connectors
import Page from "./Page";

const SpvChoicePage = ({ ...props }) => <Page {...props} />;

export default daemonStartup(settings(SpvChoicePage));
