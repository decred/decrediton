import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLNPage } from "../hooks";
import * as lna from "actions/LNActions";
import * as sel from "selectors";
import { useIntl } from "react-intl";

export function useChannelsTab() {
  const [node, setNode] = useState("");
  const [localAmtAtoms, setLocalAmtAtoms] = useState(null);
  const [pushAmtAtoms, setPushAmtAtoms] = useState(null);
  const [canOpen, setCanOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const recentlyOpenedChannelChannelPoint = useSelector(
    sel.lnRecentlyOpenedChannel
  );
  const intl = useIntl();
  const channelFilter = useSelector(sel.lnChannelFilter);

  const {
    channels,
    pendingChannels,
    closedChannels,
    isMainNet,
    openChannel,
    closeChannel,
    describeGraph
  } = useLNPage();

  const recentNodes = useMemo(
    () =>
      [
        ...new Set(
          [...pendingChannels, ...channels, ...closedChannels].map(
            (c) => c.remotePubkey
          )
        )
      ].map((pubKey) => {
        const nodeDetails = describeGraph?.nodeList?.find(
          (node) => node.pubKey === pubKey
        );
        if (nodeDetails) {
          return { pubKey: pubKey, alias: nodeDetails.alias };
        }
      }),
    [channels, pendingChannels, closedChannels, describeGraph]
  );

  const filteredChannels = useMemo(() => {
    return [...pendingChannels, ...channels, ...closedChannels]
      .filter(
        (channel) =>
          !channelFilter ||
          !channelFilter.type ||
          channelFilter.type === "all" ||
          channelFilter.type === channel.status
      )
      .filter(
        (channel) =>
          !channelFilter ||
          !channelFilter.search ||
          channel.channelPoint
            .toLowerCase()
            .indexOf(channelFilter.search.toLowerCase()) !== -1
      );
  }, [channels, pendingChannels, closedChannels, channelFilter]);

  const recentlyOpenedChannel = useMemo(
    () =>
      recentlyOpenedChannelChannelPoint
        ? [...channels, ...pendingChannels].find(
            (c) => c.channelPoint === recentlyOpenedChannelChannelPoint
          )
        : null,
    [channels, pendingChannels, recentlyOpenedChannelChannelPoint]
  );

  const onNodeChanged = (value) => {
    const node = (value || "").trim();
    const _canOpen = node && localAmtAtoms > 0;
    setNode(node);
    setCanOpen(_canOpen);
  };

  const onNodePasted = (value) => {
    onNodeChanged(value);
    // TODO: validateNode
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
        setLocalAmtAtoms(null);
        setPushAmtAtoms(null);
        setCanOpen(false);
      })
      .catch(() => setOpening(false));
  };

  const onCloseChannel = (channel) =>
    closeChannel(channel.channelPoint, !channel.active);

  const dispatch = useDispatch();
  const viewChannelDetailsHandler = (channelPoint) =>
    dispatch(lna.viewChannelDetails(channelPoint));

  const closeRecentlyOpenedChannelModal = () =>
    dispatch(lna.clearRecentlyOpenedChannelNodePubkey());

  const onChangeChannelFilter = useCallback(
    (newFilter) => dispatch(lna.changeChannelFilter(newFilter)),
    [dispatch]
  );

  const searchText = channelFilter?.search ?? "";
  const selectedChannelType = channelFilter?.type;

  const [isChangingFilterTimer, setIsChangingFilterTimer] = useState(null);

  const onChangeSelectedType = (type) => {
    onChangeFilter(type.value);
  };

  const onChangeSearchText = (searchText) => {
    onChangeFilter({ search: searchText });
  };

  const onChangeFilter = (value) => {
    return new Promise((resolve) => {
      if (isChangingFilterTimer) {
        clearTimeout(isChangingFilterTimer);
      }
      const changeFilter = (newFilterOpt) => {
        const newFilter = { ...channelFilter, ...newFilterOpt };
        clearTimeout(isChangingFilterTimer);
        onChangeChannelFilter(newFilter);
        return newFilter;
      };
      setIsChangingFilterTimer(
        setTimeout(() => resolve(changeFilter(value)), 100)
      );
    });
  };

  return {
    channels: filteredChannels,
    node,
    localAmtAtoms,
    pushAmtAtoms,
    opening,
    canOpen,
    isMainNet,
    intl,
    recentlyOpenedChannel,
    recentNodes,
    onNodeChanged,
    onNodePasted,
    onLocalAmtChanged,
    onPushAmtChanged,
    onOpenChannel,
    onCloseChannel,
    viewChannelDetailsHandler,
    closeRecentlyOpenedChannelModal,
    searchText,
    selectedChannelType,
    onChangeSelectedType,
    onChangeSearchText
  };
}
