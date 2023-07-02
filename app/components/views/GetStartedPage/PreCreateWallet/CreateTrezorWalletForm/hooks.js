import { useState } from "react";

export const CREATE_WALLET = "left";

export function useCreateTrezorWalletForm() {
  const [toggleState, setToggleState] = useState(CREATE_WALLET);

  const onToggleStateClick = (value) => {
    setToggleState(value);
  };

  return {
    toggleState,
    onToggleStateClick
  };
}
