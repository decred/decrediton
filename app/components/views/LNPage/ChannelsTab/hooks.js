import { defineMessages } from "react-intl";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLNPage } from "../hooks";
import * as lna from "actions/LNActions";
import * as sel from "selectors";
import { useIntl } from "react-intl";
import secp256k1 from "secp256k1";
import elliptic from "elliptic";

const messages = defineMessages({
  invalidNodeFormat: {
    id: "ln.channelsTab.invalidNodeFormat",
    defaultMessage: "More than one @ in the node address"
  },
  invalidNodeAddressFormat: {
    id: "ln.channelsTab.invalidNodeAddressFormat",
    defaultMessage: "More than one : in the node address"
  },
  invalidNodeId: {
    id: "ln.channelsTab.invalidNodeId",
    defaultMessage: "Invalid Node Id"
  }
});

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
  const autopilotEnabled = useSelector(sel.lnAutopilotEnabled);
  const [nodeErrorMsg, setNodeErrorMsg] = useState(null);
  const [nodeShowSuccess, setNodeShowSuccess] = useState(false);

  const location = useSelector(sel.location);
  useEffect(() => {
    const pubKey = location.query.pubKey;
    if (pubKey && pubKey != "") {
      setNode(pubKey);
    }
  }, [location]);

  const {
    channels,
    pendingChannels,
    closedChannels,
    isMainNet,
    openChannel,
    closeChannel,
    describeGraph,
    recentNodes
  } = useLNPage();

  const hideSearchBt = describeGraph?.nodeList?.length <= 1 ?? true;

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
    const isNodeValid = validateNode(node);
    const _canOpen = node && localAmtAtoms > 0 && isNodeValid;
    setNode(node);
    setCanOpen(_canOpen);
  };

  const isHexValid = (pubkey) => {
    return pubkey.length % 2 == 0 && /^[0-9a-fA-F]*$/.test(pubkey);
  };

  const validateNode = (node) => {
    setNodeErrorMsg(null);
    setNodeShowSuccess(false);
    const split = node.split("@");
    if (split.length > 2) {
      setNodeErrorMsg(intl.formatMessage(messages.invalidNodeFormat));
      return false;
    }

    let nodePubKey;
    if (split.length == 2) {
      nodePubKey = split[0];
      const addressSplit = split[1].split(":");
      if (addressSplit.length > 2) {
        setNodeErrorMsg(intl.formatMessage(messages.invalidNodeAddressFormat));
        return false;
      }
    } else {
      nodePubKey = node;
    }

    let isPubKeyValid;
    try {
      if (!isHexValid(nodePubKey)) {
        throw new Error("pubkey is not a valid hex");
      }
      const pubKeyBuffer = Buffer.from(nodePubKey, "hex");
      isPubKeyValid = secp256k1.publicKeyVerify(pubKeyBuffer);
      // check if pubkey is on the curve
      const curve = new elliptic.ec("secp256k1");
      curve.keyFromPublic(pubKeyBuffer);
    } catch (error) {
      isPubKeyValid = false;
    }

    if (!isPubKeyValid) {
      setNodeErrorMsg(intl.formatMessage(messages.invalidNodeId));
      return false;
    }

    setNodeShowSuccess(true);
    return true;
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
        setNodeErrorMsg(null);
        setNodeShowSuccess(false);
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

  const onAutopilotChanged = () =>
    dispatch(lna.modifyAutopilotStatus(!autopilotEnabled));

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
    autopilotEnabled,
    nodeShowSuccess,
    nodeErrorMsg,
    onAutopilotChanged,
    recentNodes,
    hideSearchBt,
    onNodeChanged,
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
