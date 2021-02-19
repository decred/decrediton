import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import * as sel from "selectors";

export function usePaymentsTab() {
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const onToggleShowDetails = useCallback(
    (paymentHash) => {
      setSelectedPaymentDetails(paymentHash);
      setIsShowingDetails(!isShowingDetails);
    },
    [isShowingDetails]
  );
  const channelBalances = useSelector(sel.lnChannelBalances);

  return {
    isShowingDetails,
    selectedPaymentDetails,
    onToggleShowDetails,
    channelBalances
  };
}
