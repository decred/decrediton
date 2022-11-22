import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import * as cli from "actions/ClientActions";
import { useParams } from "react-router-dom";
import { useLNPage } from "../hooks";

export const useChannelDetails = () => {
  const { channelPoint } = useParams();
  const { channels, pendingChannels, closedChannels, closeChannel } =
    useLNPage();
  const channel = useMemo(
    () =>
      [...channels, ...pendingChannels, ...closedChannels].find(
        (c) => c.channelPoint === channelPoint
      ),
    [channels, pendingChannels, closedChannels, channelPoint]
  );

  const dispatch = useDispatch();
  const goBackHistory = useCallback(
    () => dispatch(cli.goBackHistory()),
    [dispatch]
  );

  const onCloseChannel = (channel) =>
    closeChannel(channel.channelPoint, !channel.active);

  return {
    channel,
    goBackHistory,
    onCloseChannel
  };
};
