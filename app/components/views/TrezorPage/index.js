import { trezor } from "connectors";
import Page from "./Page";
import NoDevicePage from "./NoDevicePage";
import "style/Trezor.less";

const TrezorPage = ({ device, connect, ...props }) =>
  !device ? (
    <NoDevicePage onConnect={connect} />
  ) : (
    <Page device={device} {...props} />
  );

export default trezor(TrezorPage);
