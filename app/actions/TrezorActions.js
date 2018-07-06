import * as trezorjs from "trezor.js";
import trezorTransports from "trezor-link";
import * as wallet from "wallet";
import { EXTERNALREQUEST_TREZOR_BRIDGE } from "main_dev/externalRequests";

export const TRZ_LOADDEVICELIST_ATTEMPT = "TRZ_LOADDEVICELIST_ATTEMPT";
export const TRZ_LOADDEVICELIST_FAILED = "TRZ_LOADDEVICELIST_FAILED";
export const TRZ_LOADDEVICELIST_SUCCESS = "TRZ_LOADDEVICELIST_SUCCESS";
export const TRZ_DEVICELISTTRANSPORT_LOST = "TRZ_DEVICELISTTRANSPORT_LOST";
export const TRZ_SELECTEDDEVICE_CHANGED = "TRZ_SELECTEDDEVICE_CHANGED";

export const loadDeviceList = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    if (!getState().trezor.enabled) return;
    wallet.allowExternalRequest(EXTERNALREQUEST_TREZOR_BRIDGE);

    dispatch({ type: TRZ_LOADDEVICELIST_ATTEMPT });
    const debug = getState().trezor.debug;

    // TODO: decide whether we want to provide our own config blob.
    const configUrl = "https://wallet.trezor.io/data/config_signed.bin?"
      + Date.now();

    const opts = { debug, debugInfo: debug, configUrl,
      transport: new trezorTransports.BridgeV2() };
    const devList = new trezorjs.DeviceList(opts);
    let resolvedTransport = false;

    devList.on("transport", t => {
      console.log("transport", t);
      if (resolvedTransport) return;
      resolvedTransport = true; // resolved with success
      dispatch({ deviceList: devList, type: TRZ_LOADDEVICELIST_SUCCESS });
      resolve(t);
    });

    devList.on("error", err => {
      console.log("error", err);
      if (!resolvedTransport && err.message.includes("ECONNREFUSED")) {
        resolvedTransport = true; // resolved with failure
        dispatch({ error: err.message, type: TRZ_LOADDEVICELIST_FAILED });
        reject(err);
      } else if (err.message.includes("socket hang up")) {
        // this might happen any time throughout the app lifetime if the bridge
        // service is shutdown for any reason
        dispatch({ error: err.message, type: TRZ_DEVICELISTTRANSPORT_LOST });
      }
    });

    devList.on("connect", device => {
      console.log("connect", Object.keys(devList.devices), device);
      const currentDevice = getState().trezor.device;
      if (!currentDevice) {
        // first device connected. Use it.
        dispatch({ device, type: TRZ_SELECTEDDEVICE_CHANGED });
      }
    });

    devList.on("disconnect", device => {
      console.log("disconnect", Object.keys(devList.devices), device);
      const currentDevice = getState().trezor.device;
      if (currentDevice && device.originalDescriptor.path === currentDevice.originalDescriptor.path ) {
        const devicePaths = Object.keys(devList.devices);

        // we were using the device that was just disconnected. Pick a new
        // device to use.
        if (devicePaths.length === 0) {
          // no more devices left to use
          dispatch({ device: null, type: TRZ_SELECTEDDEVICE_CHANGED });
        } else {
          dispatch({ device: devList.devices[devicePaths[0]], type: TRZ_SELECTEDDEVICE_CHANGED });
        }
      }
    });

    devList.on("connectUnacquired", device => {
      console.log("connect unacquired", device);
    });

    devList.on("disconnectUnacquired", device => {
      console.log("disconnect unacquired", device);
    });

  });
};

export const selectDevice = (path) => async (dispatch, getState) => {
  const devList = getState().trezor.deviceList;
  if (!devList.devices[path]) return;
  dispatch({ device: devList.devices[path], type: TRZ_SELECTEDDEVICE_CHANGED });
};
