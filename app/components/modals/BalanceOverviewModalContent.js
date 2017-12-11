import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-green"><T id="balanceInfoModal.total.label" m="Total" /></span>
        <span className="info-modal-row-text"><T id="balanceInfoModal.total.text" m="This is the total balance controlled by this account currently." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="balanceInfoModal.spendable.label" m="Spendable Balance" /></span>
        <span className="info-modal-row-text"><T id="balanceInfoModal.spendable.text" m="The spendable/accessible balance for the this account." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="balanceInfoModal.locked.label" m="Locked By Tickets" /></span>
        <span className="info-modal-row-text"><T id="balanceInfoModal.locked.text" m="This is the balance that is currently locked by tickets for this account. Once the tickets are voted or revoked these funds will be unlocked." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="balanceInfoModal.voting.label" m="Voting Authority" /></span>
        <span className="info-modal-row-text"><T id="balanceInfoModal.voting.text" m="This balance shows the total amount that this account has voting authority over.  For example, if you use a voting-only wallet this will show that total amount controlled." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="balanceInfoModal.immatureRewards.label" m="Immature Rewards" /></span>
        <span className="info-modal-row-text"><T id="balanceInfoModal.immatureRewards.text" m="These are regular coinbase rewards that are currently maturing (from PoW mining reward for instance)." /></span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue"><T id="balanceInfoModal.immatureStake.label" m="Immature Stake Generation" /> </span>
        <span className="info-modal-row-text"><T id="balanceInfoModal.immatureStake.text" m="This balance shows the current stake rewards and revocations that are awaiting maturity (256 blocks on mainnet)." /></span>
      </span>
    </p>
  </Aux>
);
