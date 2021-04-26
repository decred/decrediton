import { useEffect, useState, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import * as sel from "selectors";

export const useDexRegisterPage = ({ defaultServerAddress, onGetConfig }) => {
  const [isValid, setIsValid] = useState(false);
  const [addr, setAddress] = useState(defaultServerAddress);
  const [error, setIsError] = useState("");

  const dexAccountNumber = useSelector(sel.dexAccountNumber);
  const defaultSpendingAccount = useSelector(
    sel.defaultSpendingAccount,
    shallowEqual
  );
  const dexAccountSpendable = useSelector(sel.dexAccountSpendable);

  const resetState = useCallback(() => {
    setAddress(null);
  }, []);

  const onGetConfigDex = () => {
    onGetConfig(addr);
    resetState();
  };

  useEffect(() => {
    setIsValid(!!addr);
  }, [addr]);

  useEffect(() => {
    if (addr === null) {
      return;
    }
    if (isValid) {
      setIsError(null);
      return;
    }
    if (!addr) {
      const error = (
        <T id="error.Dex.Address" m="Please enter a valid DEX Server." />
      );
      setIsError(error);
      return;
    }
  }, [isValid, addr]);

  return {
    onGetConfigDex,
    error,
    isValid,
    addr,
    setAddress,
    dexAccountNumber,
    defaultSpendingAccount,
    dexAccountSpendable
  };
};
