export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-green">Total</span>
        <span className="info-modal-row-text">This is the total balance controlled by this account currently.</span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue">Spendable Balance</span>
        <span className="info-modal-row-text"> The spendable/accessible balance for the this account.</span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue">Locked By Tickets</span>
        <span className="info-modal-row-text"> This is the balance that is currently locked by tickets for this account. Once the tickets are voted or revoked these funds will be unlocked.</span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue">Voting Authority</span>
        <span className="info-modal-row-text"> This balance shows the total amount that this account has voting authority over.  For example, if you use a voting-only wallet this will show that total amount controlled.</span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue">Immature Rewards</span>
        <span className="info-modal-row-text"> These are regular coinbase rewards that are currently maturing (from PoW mining reward for instance).</span>
      </span>
      <span className="info-modal-row">
        <span className="info-modal-row-label highlight-blue">Immature Stake Generation </span>
        <span className="info-modal-row-text"> This balance shows the current stake rewards and revocations that are awaiting maturity (256 blocks on mainnet).</span>
      </span>
    </p>
  </Aux>
);
