import { useSelector } from "react-redux";
import { useDaemonStartup } from "hooks";
import * as sel from "selectors";

export const useTrezorLoaderBarContainer = () => {
  const { trezorDevice } = useDaemonStartup();
  const deviceLabel = useSelector(sel.trezorLabel);

  return { trezorDevice, deviceLabel };
};
