import { FormattedMessage as T } from "react-intl";
export const getDecodedPayRequestDetails = (decoded) => {
  const details = [
    {
      label: <T id="ln.decodedPayRequestDetails.ctlvExpiry" m="Ctlv Expiry" />,
      value: decoded.cltvExpiry
    },
    {
      label: (
        <T id="ln.decodedPayRequestDetails.fallbackAddr" m="Fallback Address" />
      ),
      value: decoded.fallbackAddr || (
        <T
          id="ln.decodedPayRequestDetails.emptyFallbackAddr"
          m="(empty fallback address)"
        />
      )
    },
    {
      label: (
        <T id="ln.decodedPayRequestDetails.paymentAddr" m="Payment Address" />
      ),
      value: decoded.paymentAddrHex,
      truncate: 40
    }
  ];

  return details;
};
