import * as sel from "selectors";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as lna from "actions/LNActions";

export function useNetworkTab() {
  const dispatch = useDispatch();
  const network = useSelector(sel.lnNetwork);
  const nodeInfo = useSelector(sel.lnNodeInfo);
  const routesInfo = useSelector(sel.lnRoutesInfo);
  const getNodeInfoAttempt = useSelector(sel.lnGetNodeInfoAttempt);
  const getRoutesInfoAttempt = useSelector(sel.lnGetRoutesInfoAttempt);
  const tsDate = useSelector(sel.tsDate);

  useEffect(() => {
    !network && dispatch(lna.getNetworkInfo());
  }, [network, dispatch]);

  const getNodeInfo = nodeId => dispatch(lna.getNodeInfo(nodeId));
  const getRoutesInfo = (nodeId, amt) => dispatch(lna.getRoutesInfo(nodeId, amt));

  const txOutURLBuilder = useSelector(sel.txOutURLBuilder);
  const chanpointURL = (chanPoint) => {
    const split = chanPoint.split(":");
    if (split.length !== 2) {
      return "";
    }
    return txOutURLBuilder(split[0], split[1]);
  };

  return {
    network,
    nodeInfo,
    routesInfo,
    tsDate,
    getNodeInfo,
    getNodeInfoAttempt,
    getRoutesInfoAttempt,
    getRoutesInfo,
    chanpointURL
  };
};
