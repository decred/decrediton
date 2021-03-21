import { useState } from "react";
import { useLNPage } from "../hooks";

export function useChannelsTab() {
  const [node, setNode] = useState("");
  const [localAmtAtoms, setLocalAmtAtoms] = useState(0);
  const [pushAmtAtoms, setPushAmtAtoms] = useState(0);
  const [canOpen, setCanOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [detailedChannel, setDetailedChannel] = useState();

  const {
    walletBalances,
    channelBalances,
    channels,
    pendingChannels,
    closedChannels,
    isMainNet,
    openChannel,
    closeChannel
  } = useLNPage();

  const onNodeChanged = (e) => {
    const _canOpen = e.target.value && localAmtAtoms > 0;
    setNode(("" + e.target.value).trim());
    setCanOpen(_canOpen);
  };

  const onLocalAmtChanged = ({ atomValue }) => {
    const _canOpen = atomValue > 0 && node;
    setLocalAmtAtoms(atomValue);
    setCanOpen(_canOpen);
  };

  const onPushAmtChanged = ({ atomValue }) => {
    setPushAmtAtoms(atomValue);
  };

  const onOpenChannel = () => {
    if (!node || !localAmtAtoms) {
      return;
    }
    setOpening(true);
    openChannel(node, localAmtAtoms, pushAmtAtoms)
      .then(() => {
        setOpening(false);
        setNode("");
        setLocalAmtAtoms(0);
        setPushAmtAtoms(0);
        setCanOpen(false);
      })
      .catch(() => {
        setOpening(false);
      });
  };

  const onCloseChannel = (channel) => {
    closeChannel(channel.channelPoint, !channel.active);
  };

  const onToggleChannelDetails = (channel) => {
    if (detailedChannel === channel) {
      setDetailedChannel(null);
    } else {
      setDetailedChannel(channel);
    }
  };

  return {
    walletBalances,
    channelBalances,
    channels,
    pendingChannels,
    closedChannels,
    node,
    localAmtAtoms,
    pushAmtAtoms,
    opening,
    canOpen,
    detailedChannel,
    isMainNet,
    onNodeChanged,
    onLocalAmtChanged,
    onPushAmtChanged,
    onOpenChannel,
    onCloseChannel,
    onToggleChannelDetails
  };
};
