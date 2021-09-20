import { FormattedMessage as T } from "react-intl";
import FlatBalance from "./FlatBalance";
import * as lna from "actions/LNActions";
import { CHANNEL_STATUS_ACTIVE, CHANNEL_STATUS_PENDING } from "constants";

export const getChannelDetails = (channel) => {
  return channel.status === CHANNEL_STATUS_ACTIVE
    ? getOpenChannelDetails(channel)
    : channel.status === CHANNEL_STATUS_PENDING
    ? getPendingChannelDetails(channel)
    : getClosedChannelDetails(channel);
};

const getOpenChannelDetails = (channel) => {
  const details = [
    {
      label: <T id="ln.openChannelDetails.chanId" m="Channel ID" />,
      value: channel.chanId
    },
    {
      label: <T id="ln.openChannelDetails.channelPoint" m="Channel Point" />,
      value: channel.channelPoint,
      href: channel.channelPointURL,
      truncate: 10
    },
    {
      label: <T id="ln.openChannelDetails.commitFee" m="Commit Fee" />,
      value: <FlatBalance amount={channel.commitFee} />
    },
    {
      label: <T id="ln.openChannelDetails.csvDelay" m="CSV Delay" />,
      value: (
        <T
          id="ln.openChannelDetails.csvDelayValue"
          m="{csvDelay} Blocks"
          values={{
            csvDelay: channel.csvDelay
          }}
        />
      )
    },
    {
      label: <T id="ln.openChannelDetails.remotePubKey" m="Remote PubKey" />,
      value: channel.remotePubkey,
      truncate: 10,
      copyable: true
    },
    {
      label: <T id="ln.openChannelDetails.numUpdates" m="Number of Updates" />,
      value: channel.numUpdates
    },
    {
      label: (
        <T id="ln.openChannelDetails.localChannelReserve" m="Local Reserve" />
      ),
      value: <FlatBalance amount={channel.localChanReserveAtoms} />
    },
    {
      label: (
        <T id="ln.openChannelDetails.remoteChannelReserve" m="Remote Reserve" />
      ),
      value: <FlatBalance amount={channel.remoteChanReserveAtoms} />
    },
    {
      label: (
        <T id="ln.openChannelDetails.unsettledBalance" m="Unsettled Balance" />
      ),
      value: <FlatBalance amount={channel.unsettledBalance} />
    },
    {
      label: <T id="ln.openChannelDetails.totalSent" m="Total Sent" />,
      value: <FlatBalance amount={channel.totalAtomsSent} />
    },
    {
      label: <T id="ln.openChannelDetails.totalReceived" m="Total Received" />,
      value: <FlatBalance amount={channel.totalAtomsReceived} />
    }
  ];

  return details;
};

const getPendingChannelDetails = (channel) => {
  const details = [
    {
      label: <T id="ln.pendingChannelDetails.channelPoint" m="Channel Point" />,
      value: channel.channelPoint,
      href: channel.channelPointURL,
      truncate: 10
    },
    {
      label: <T id="ln.pendingChannelDetails.remotePubKey" m="Remote PubKey" />,
      value: channel.remotePubkey,
      truncate: 10,
      copyable: true
    }
  ];

  const typeLabel = <T id="ln.pendingChannelDetails.type" m="Type" />;
  switch (channel.pendingStatus) {
    case "open":
      details.unshift({
        label: typeLabel,
        value: <T id="ln.pendingChannelDetails.typeOpen" m="Open" />
      });
      details.push({
        label: <T id="ln.pendingOpenDetails.commitFee" m="Commit Fee" />,
        value: <FlatBalance amount={channel.commitFee} />
      });
      break;
    case "close":
      details.unshift({
        label: typeLabel,
        value: <T id="ln.pendingChannelDetails.typeClose" m="Close" />
      });
      break;
    case "forceclose":
      details.unshift({
        label: typeLabel,
        value: (
          <T id="ln.pendingChannelDetails.typeForceclose" m="Force Close" />
        )
      });
      details.push(
        {
          label: (
            <T id="ln.pendingForceCloseDetails.closingTx" m="Closing Tx" />
          ),
          value: channel.closingTxid,
          href: channel.closingTxidURL,
          truncate: 10
        },
        {
          label: (
            <T
              id="ln.pendingForceCloseDetails.limboBalance"
              m="Limbo Balance"
            />
          ),
          value: <FlatBalance amount={channel.limboBalance} />
        },
        {
          label: (
            <T
              id="ln.pendingForceCloseDetails.recoveredBalance"
              m="Recovered Balance"
            />
          ),
          value: <FlatBalance amount={channel.recoveredBalance} />
        }
      );
      break;
    case "waitclose":
      details.unshift({
        label: typeLabel,
        value: (
          <T id="ln.pendingChannelDetails.typeWaitclose" m="Waiting Close" />
        )
      });
      details.push({
        label: <T id="ln.waitCloseDetails.limboBalance" m="Limbo Balance" />,
        value: <FlatBalance amount={channel.limboBalance} />
      });
      break;
  }

  return details;
};

const closeTypes = {
  [lna.CLOSETYPE_COOPERATIVE_CLOSE]: (
    <T id="ln.closeTypeCooperative" m="Cooperative" />
  ),
  [lna.CLOSETYPE_LOCAL_FORCE_CLOSE]: (
    <T id="ln.closeTypeLocalForce" m="Local Force-close" />
  ),
  [lna.CLOSETYPE_REMOTE_FORCE_CLOSE]: (
    <T id="ln.closeTypeRemoteForce" m="Remote Force-close" />
  ),
  [lna.CLOSETYPE_BREACH_CLOSE]: (
    <T id="ln.closeTypeBreach" m="Breach Force-close" />
  ),
  [lna.CLOSETYPE_FUNDING_CANCELED]: (
    <T id="ln.closeTypeFundingCanceled" m="Funding Canceled" />
  ),
  [lna.CLOSETYPE_ABANDONED]: <T id="ln.closeTypeAbandoned" m="Abandoned" />
};

const getClosedChannelDetails = (channel) => {
  const details = [
    {
      label: <T id="ln.closedChannelDetails.chanId" m="Channel ID" />,
      value: channel.chanId
    },
    {
      label: <T id="ln.closedChannelDetails.closeType" m="Close Type" />,
      value: closeTypes[channel.closeType]
    },
    {
      label: <T id="ln.closedChannelDetails.channelPoint" m="Channel Point" />,
      value: channel.channelPoint,
      href: channel.channelPointURL,
      truncate: 10
    },
    {
      label: <T id="ln.closedChannelDetails.closingTx" m="Closing Tx" />,
      value: channel.closingTxHash,
      href: channel.closingTxidURL,
      truncate: 10
    },
    {
      label: <T id="ln.closedChannelDetails.remotePubKey" m="Remote PubKey" />,
      value: channel.remotePubkey,
      truncate: 10,
      copyable: true
    }
  ];

  return details;
};
