import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion, Tooltip } from "shared";
import { KeyBlueButton, CloseChannelModalButton } from "buttons";
import { TextInput, DcrInput } from "inputs";
import { default as OpenChannel, OpenChannelDetails, CloseChannelModalContent } from "./OpenChannel";
import { default as PendingChannel, PendingChannelDetails } from "./PendingChannel";
import { default as ClosedChannel, ClosedChannelDetails } from "./ClosedChannel";

export default ({
  balance,
  pendingOpenBalance,
  maxInboundAmount,
  maxOutboundAmount,
  channels,
  pendingChannels,
  closedChannels,
  node,
  localAmt,
  pushAmt,
  opening,
  canOpen,
  isMainNet,
  detailedChannel,
  onNodeChanged,
  onLocalAmtChanged,
  onPushAmtChanged,
  onOpenChannel,
  onCloseChannel,
  onToggleChannelDetails
}) => (
  <>
    <div className="ln-wallet-balances">
      <div><T id="ln.channelsTab.balance" m="Balance" /></div>
      <Balance amount={balance} />
      <div><T id="ln.channelsTab.pendingOpenBalance" m="Pending Open" /></div>
      <Balance amount={pendingOpenBalance} />
      <div><T id="ln.walletTab.maxInboundAmt" m="Max. Receivable" /></div>
      <Balance amount={maxInboundAmount} />
      <div><T id="ln.walletTab.maxOutboundAmt" m="Max. Payable" /></div>
      <Balance amount={maxOutboundAmount} />
    </div>

    <h2 className="ln-invoice-subheader"><T id="ln.channelsTab.openChannel" m="Open Channel" /></h2>

    <div className="ln-open-new-channel">
      <div className="node">
        <T id="ln.openChannel.node" m="Counterparty (node@ip:port)" />
        <TextInput value={node} onChange={onNodeChanged} />
      </div>
      <div className="local-amt">
        <T id="ln.openChannel.localAmt" m="Total Funding Amount" />
        <DcrInput amount={localAmt} onChangeAmount={onLocalAmtChanged} />
      </div>
      { isMainNet ? null : // Not allowing to push atoms in mainnet as a precaution from inadvertent user action for the moment.
        <div className="push-amt">
          <T id="ln.openChannel.pushAmt" m="Push Amount (optional)" />
          <DcrInput amount={pushAmt} onChangeAmount={onPushAmtChanged} />
        </div>
      }
      <KeyBlueButton className="open-btn" onClick={onOpenChannel} loading={opening} disabled={opening || !canOpen}>
        <T id="ln.openChannel.openBtn" m="Open" />
      </KeyBlueButton>
    </div>

    { pendingChannels.length > 0
      ? <h2 className="ln-invoice-subheader"><T id="ln.channelsTab.pendingList" m="Pending Channels" /></h2>
      : null
    }
    <div className="ln-wallet-open-channels-list">
      { pendingChannels.map(c =>
        <VerticalAccordion
          key={c.channelPoint}
          height={180}
          onToggleAccordion={() => onToggleChannelDetails(c)}
          show={c === detailedChannel}
          header={<PendingChannel channel={c} />}
        >
          <PendingChannelDetails channel={c} />
        </VerticalAccordion>
      )}
    </div>


    <h2 className="ln-invoice-subheader"><T id="ln.channelsTab.channelList" m="Open Channels" /></h2>
    <div className="ln-wallet-open-channels-list">
      { channels.map(c =>
        <div className="openchannel-header-wrapper" key={c.channelPoint}>
          <Tooltip className="close-channel-btn" text={<T id="ln.channelsTab.closeChannelBtn" m="Close the channel"/>}>
            <CloseChannelModalButton
              modalTitle={<T id="ln.channelsTab.closeChannelModalTitle" m="Close Channel"/>}
              modalContent={ <CloseChannelModalContent channel={c} />}
              onSubmit={() => onCloseChannel(c)}
            />
          </Tooltip>

          <VerticalAccordion
            height={280}
            onToggleAccordion={() => onToggleChannelDetails(c)}
            show={c === detailedChannel}
            header={<OpenChannel channel={c} onCloseChannel={onCloseChannel} />}
          >
            <OpenChannelDetails channel={c} />
          </VerticalAccordion>
        </div>
      ) }
    </div>

    { closedChannels.length > 0
      ? <h2 className="ln-invoice-subheader"><T id="ln.channelsTab.closedList" m="Closed Channels" /></h2>
      : null
    }
    <div className="ln-wallet-closed-channels-list">
      { closedChannels.map(c =>
        <VerticalAccordion
          key={c.channelPoint}
          height={180}
          onToggleAccordion={() => onToggleChannelDetails(c)}
          show={c === detailedChannel}
          header={<ClosedChannel channel={c} />}
        >
          <ClosedChannelDetails channel={c} />
        </VerticalAccordion>
      )}
    </div>

  </>
);
