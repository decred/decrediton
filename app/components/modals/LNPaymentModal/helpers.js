import { FormattedMessage as T } from "react-intl";
import { SmallButton } from "buttons";
import { CopyToClipboard, TruncatedText } from "shared";
export const getPaymentDetails = (payment, tsDate) => {
  const details = [
    {
      label: <T id="ln.paymentModal.hash" m="Hash" />,
      value: (
        <>
          <TruncatedText text={payment?.paymentHash} max={40} showTooltip />
          <CopyToClipboard
            textToCopy={payment?.paymentHash}
            ButtonComponent={SmallButton}
          />
        </>
      )
    }
  ];

  payment?.htlcsList?.forEach((htlc, index) => {
    const response = {
      label: (
        <>
          <T id="ln.paymentModal.htlc" m="HTLC" /> {index}
        </>
      ),
      value: [
        {
          label: <T id="ln.paymentModal.htlc.state" m="State" />,
          value: htlc.state
        },
        {
          label: <T id="ln.paymentModal.htlc.chanId" m="Channel id" />,
          value: htlc.chanId
        },
        {
          label: <T id="ln.paymentModal.htlc.acceptHeight" m="Accept Height" />,

          value: htlc.acceptHeight
        },
        {
          label: (
            <T id="ln.paymentModal.htlc.acceptTimeLabel" m="Accept Time" />
          ),
          value: (
            <T
              id="ln.paymentModal.htlc.acceptTime"
              m="{acceptTime, date, medium} {acceptTime, time, short}"
              values={{ acceptTime: tsDate(htlc.acceptTime) }}
            />
          )
        },
        {
          label: <T id="ln.paymentModal.htlc.expiryHeight" m="Expiry Height" />,

          value: htlc.expiryHeight
        },
        {
          label: (
            <T id="ln.paymentModal.htlc.resolveTimeLabel" m="Resolve Time" />
          ),
          value: (
            <T
              id="ln.paymentModal.htlc.resolveTime"
              m="{resolveTime, date, medium} {resolveTime, time, short}"
              values={{ resolveTime: tsDate(htlc.resolveTime) }}
            />
          )
        }
      ]
    };
    details.push(response);
  });

  return details;
};
