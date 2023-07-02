import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as wla from "actions/WalletLoaderActions";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

export const useCreateWallet = () => {
  const pageBodyTopRef = useSelector(sel.pageBodyTopRef);
  const dispatch = useDispatch();
  const decodeSeed = useCallback(
    (seed) => dispatch(wla.decodeSeed(seed)),
    [dispatch]
  );
  const cancelCreateWallet = useCallback(
    () => dispatch(wla.cancelCreateWallet()),
    [dispatch]
  );
  const generateSeed = useCallback(
    () => dispatch(wla.generateSeed()),
    [dispatch]
  );
  // TODO implement pubpass
  const createWatchOnlyWalletRequest = useCallback(
    (extendedPubKey, pubPass = "") =>
      dispatch(wla.createWatchOnlyWalletRequest(extendedPubKey, pubPass)),
    [dispatch]
  );
  const createWalletRequest = useCallback(
    (pubpass, passPhrase, seed, isNew, gapLimit, disableCoinTypeUpgrades) =>
      dispatch(
        wla.createWalletRequest(
          pubpass,
          passPhrase,
          seed,
          isNew,
          gapLimit,
          disableCoinTypeUpgrades
        )
      ),
    [dispatch]
  );
  const isTestNet = useSelector(sel.isTestNet);
  const setPageBodyScrollHandler = useCallback(
    (scrollHandler) => dispatch(ca.setPageBodyScrollHandler(scrollHandler)),
    [dispatch]
  );

  return {
    decodeSeed,
    cancelCreateWallet,
    generateSeed,
    createWatchOnlyWalletRequest,
    createWalletRequest,
    isTestNet,
    setPageBodyScrollHandler,
    pageBodyTopRef
  };
};
