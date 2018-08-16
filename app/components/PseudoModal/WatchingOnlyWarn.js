const WatchingOnlyWarnModal = () => (
  <Aux>
    <div className={"pseudo-modal-overlay"}></div>
    <div className={"pseudo-modal info-modal"}>
      <div className={"watch-only-modal-title"}>This function is disabled for watch-only Wallets</div>
      <div className={"watch-only-modal-content"}>
        In order to gain full access to your Wallets functionalities,
        please re-create your Wallet with the watch-only option disabled.
      </div>
    </div>
  </Aux>
);

export default WatchingOnlyWarnModal;
