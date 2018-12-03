import { trezor } from "connectors";
import Page from "./Page";
import NoDevicePage from "./NoDevicePage";
import "style/Trezor.less";

const TrezorPage = ({ device, reloadDeviceList, ...props }) => (
  !device
    ? <NoDevicePage onReloadDeviceList={reloadDeviceList} />
    : <Page device={device} { ...props } />
);

export default trezor(TrezorPage);
