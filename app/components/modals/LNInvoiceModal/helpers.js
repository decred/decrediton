import { FormattedMessage as T } from "react-intl";
export const getInvoiceDetails = (invoice, tsDate) => {
  const details = [
    {
      label: <T id="ln.invoicesModal.hash" m="Hash" />,
      value: invoice?.rHashHex
    },

    {
      label: <T id="ln.invoicesModal.desc" m="Description" />,
      value: invoice?.memo
    }
  ];

  invoice?.htlcsList?.forEach((htlc, index) => {
    const response = {
      label: (
        <>
          <T id="ln.invoicesModal.htlc" m="HTLC" /> {index}
        </>
      ),
      value: [
        {
          label: <T id="ln.invoicesModal.htlc.state" m="State" />,
          value: htlc.state
        },
        {
          label: <T id="ln.invoicesModal.htlc.chanId" m="Channel id" />,
          value: htlc.chanId
        },
        {
          label: (
            <T id="ln.invoicesModal.htlc.acceptHeight" m="Accept Height" />
          ),

          value: htlc.acceptHeight
        },
        {
          label: (
            <T id="ln.invoicesModal.htlc.acceptTimeLabel" m="Accept Time" />
          ),
          value: (
            <T
              id="ln.invoicesModal.htlc.acceptTime"
              m="{acceptTime, date, medium} {acceptTime, time, short}"
              values={{ acceptTime: tsDate(htlc.acceptTime) }}
            />
          )
        },
        {
          label: (
            <T id="ln.invoicesModal.htlc.expiryHeight" m="Expiry Height" />
          ),

          value: htlc.expiryHeight
        },
        {
          label: (
            <T id="ln.invoicesModal.htlc.resolveTimeLabel" m="Resolve Time" />
          ),
          value: (
            <T
              id="ln.invoicesModal.htlc.resolveTime"
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
