import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";

export default ({
  alias,
  identityPubkey,
  confirmedBalance,
  totalBalance,
  unconfirmedBalance
}) => (
  <>
    <div className="ln-wallet-balances">
      <div><T id="ln.walletTab.alias" m="Node Alias" /></div>
      <span>{alias}</span>
      <div><T id="ln.walletTab.pubkey" m="Node Pubkey" /></div>
      <span>{identityPubkey}</span>
      <div><T id="ln.walletTab.confirmedBalance" m="Confirmed" /></div>
      <Balance amount={confirmedBalance} />
      <div><T id="ln.walletTab.unconfirmedBalance" m="Unconfirmed" /></div>
      <Balance amount={unconfirmedBalance} />
      <div><T id="ln.walletTab.totalBalance" m="Total" /></div>
      <Balance amount={totalBalance} />
    </div>
  </>
);
