import { FormattedMessage as T } from "react-intl";
import { UnsignedTx } from "shared";
import "style/StakePool.less";

const UnsignedTicket = ({ splitTx, unsignedTickets }) => (
  <>
    {splitTx && (
      <UnsignedTx
        tx={splitTx}
        title={<T id="purchase.splitTx" m="Split Tx:" />}
      />
    )}
    {unsignedTickets &&
      unsignedTickets.map((unsignedTicket, index) => (
        <UnsignedTx
          key={index}
          tx={unsignedTicket}
          title={
            <T
              id="purchase.unsignedTickets"
              m="Unsigned Ticket {number}"
              values={{ number: index + 1 }}
            />
          }
        />
      ))}
  </>
);

export default UnsignedTicket;
