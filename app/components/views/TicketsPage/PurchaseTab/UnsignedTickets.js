import { FormattedMessage as T } from "react-intl";
import { UnsignedTx } from "shared";
import "style/StakePool.less";

const UnsignedTicket = ({ splitTx, unsignedTickets }) => (
  <>
    { splitTx && <UnsignedTx
      tx={splitTx} title={<T id="purchase.splitTx" m="Split Tx:" />} />
    }
    { unsignedTickets && unsignedTickets.map(unsignedTicket => <UnsignedTx
      tx={unsignedTicket}
      title={ <T id="purchase.unsignedTickets" m="Unsigned Tickets:" />} />
    )}
  </>
);

export default UnsignedTicket;
