import { useSelector, useDispatch } from "react-redux";
import * as vspa from "actions/VSPActions";
import * as sel from "selectors";
import { useEffect } from "react";
import { PurchasePage } from "./Page";
import "style/PurchaseTickets.less";

const Tickets = ({ ...props }) => {
  const dispatch = useDispatch();
  const discoverAvailableStakepools = () =>
    dispatch(vspa.discoverAvailableStakepools());
  const spvMode = useSelector(sel.isSPV);
  const blocksNumberToNextTicket = useSelector(sel.blocksNumberToNextTicket);
  const sidebarOnBottom = useSelector(sel.sidebarOnBottom);
  const isWatchingOnly = useSelector(sel.isWatchingOnly);
  useEffect(() => {
    discoverAvailableStakepools();
  }, []);

  return <PurchasePage {...{
      spvMode,
      blocksNumberToNextTicket,
      sidebarOnBottom,
      isWatchingOnly,
      ...props
    }} />;
};

export default Tickets;
