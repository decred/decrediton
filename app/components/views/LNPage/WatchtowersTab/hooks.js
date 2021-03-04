import * as sel from "selectors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as lna from "actions/LNActions";

export function useWatchtowersTab() {
  const dispatch = useDispatch();
  const addWatchtower = (wtPubKey, addr) =>
    dispatch(lna.addWatchtower(wtPubKey, addr));
  const removeWatchtower = (wtPubKey) =>
    dispatch(lna.removeWatchtower(wtPubKey));
  const listWatchtowers = () => dispatch(lna.listWatchtowers());
  const towersList = useSelector(sel.lnTowersList);

  useEffect(() => {
    dispatch(lna.listWatchtowers());
  }, [dispatch]);

  return {
    addWatchtower,
    removeWatchtower,
    listWatchtowers,
    towersList
  };
}
