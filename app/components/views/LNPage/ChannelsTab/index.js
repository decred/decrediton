import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { lnPage } from "connectors";
import Page from "./Page";

export const ChannelsTabHeader = () =>
  <DescriptionHeader
    description={<T id="ln.description.channels" m="Open and pending channels of this LN Wallet" />}
  />;

@autobind
class ChannelsTab extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      node: "",
      localAmt: 0,
      localAmtAtoms: 0,
      pushAmt: 0,
      pushAmtAtoms: 0,
      canOpen: false,
      opening: false
    };
  }

  onNodeChanged(e) {
    const canOpen = e.target.value && this.state.localAmt > 0;
    this.setState({ node: (""+e.target.value).trim(), canOpen });
  }

  onLocalAmtChanged({ value, atomValue }) {
    const canOpen = atomValue > 0 && this.state.node;
    this.setState({ localAmt: value, localAmtAtoms: atomValue, canOpen });
  }

  onPushAmtChanged({ value, atomValue }) {
    this.setState({ pushAmt: value, pushAmtAtoms: atomValue });
  }

  onOpenChannel() {
    const { node, localAmtAtoms, pushAmtAtoms } = this.state;
    if (!node || !localAmtAtoms) {
      return;
    }
    this.setState({ opening: true });
    this.props.openChannel(node, localAmtAtoms, pushAmtAtoms).then(() => {
      this.setState({ opening: false, node: "", localAmt: 0, pushAmt: 0,
        localAmtAtoms: 0, pushAmtAtoms: 0 });
    }).catch(() => {
      this.setState({ opening: false });
    });
  }

  onCloseChannel(channel) {
    this.props.closeChannel(channel.channelPoint, !channel.active);
  }

  onToggleChannelDetails(channel) {
    if (this.state.detailedChannel === channel) {
      this.setState({ detailedChannel: null });
    } else {
      this.setState({ detailedChannel: channel });
    }
  }

  render() {
    const { balance, pendingOpenBalance, maxInboundAmount,
      maxOutboundAmount } = this.props.channelBalances;

    const { channels, pendingChannels, closedChannels, isMainNet } = this.props;
    const { node, localAmt, pushAmt, opening, canOpen,
      detailedChannel } = this.state;
    const { onNodeChanged, onLocalAmtChanged, onPushAmtChanged,
      onOpenChannel, onCloseChannel, onToggleChannelDetails } = this;

    return (
      <Page
        balance={balance}
        pendingOpenBalance={pendingOpenBalance}
        maxInboundAmount={maxInboundAmount}
        maxOutboundAmount={maxOutboundAmount}
        channels={channels}
        pendingChannels={pendingChannels}
        closedChannels={closedChannels}
        node={node}
        localAmt={localAmt}
        pushAmt={pushAmt}
        opening={opening}
        canOpen={canOpen}
        detailedChannel={detailedChannel}
        testnet={isMainNet}
        onNodeChanged={onNodeChanged}
        onLocalAmtChanged={onLocalAmtChanged}
        onPushAmtChanged={onPushAmtChanged}
        onOpenChannel={onOpenChannel}
        onCloseChannel={onCloseChannel}
        onToggleChannelDetails={onToggleChannelDetails}
      />
    );
  }
}

export default lnPage(ChannelsTab);
