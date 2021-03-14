import { useSelector } from "react-redux";
import * as sel from "selectors";

const useNetwork = () => {
  const network = useSelector(sel.network);
  const networks = useSelector(sel.networks);
  const isTestNet = useSelector(sel.isTestNet);
  const isMainNet = useSelector(sel.isMainNet);

  return {
    network,
    networks,
    isTestNet,
    isMainNet
  };
};

export default useNetwork;
