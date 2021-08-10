import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
export const getPaymentDetails = (payment) => {
  const details = [
    {
      label: <T id="ln.paymentModal.hash" m="Hash" />,
      value: payment?.paymentHash,
      copyable: true,
      truncate: 40
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
          label: <T id="ln.paymentModal.htlc.status" m="Status" />,
          value: htlc.status
        },
        {
          label: <T id="ln.paymentModal.htlc.totalAmt" m="Total Amount" />,
          value: <Balance amount={htlc.route.totalAmt} />
        },
        {
          label: <T id="ln.paymentModal.htlc.totalFees" m="Total Fees" />,
          value: <Balance amount={htlc.route.totalFees} />
        }
      ]
    };
    // hopList
    htlc.route?.hopsList?.forEach((hop, hopIndex) => {
      const hopResponse = {
        label: (
          <>
            <T id="ln.paymentModal.routeHop" m="Hop" /> {hopIndex}
          </>
        ),
        value: [
          {
            label: <T id="ln.paymentModal.htlc.hop.fee" m="Fee" />,
            value: <Balance amount={hop.fee} />
          },
          {
            label: <T id="ln.paymentModal.htlc.hop.pubkey" m="PubKey" />,
            value: hop.pubKey,
            copyable: true,
            truncate: 20
          }
        ]
      };
      response.value.push(hopResponse);
    });

    details.push(response);
  });

  return details;
};
