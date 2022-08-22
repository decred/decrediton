import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames, Tooltip, Button } from "pi-ui";
import { Subtitle } from "shared";
import {
  PiUiButton,
  EyeFilterMenu,
  CloseChannelModalButton,
  SearchForNodesButton
} from "buttons";
import { TextInput, DcrInput } from "inputs";
import { DescriptionHeader } from "layout";
import { wallet } from "wallet-preload-shim";
import styles from "./ChannelsTab.module.css";
import { useChannelsTab } from "./hooks";
import {
  ChannelCard,
  CloseChannelModalContent,
  getChannelDetails
} from "../ChannelDetailsPage/helpers";
import BalancesHeader from "../BalancesHeader";
import { LNChannelModal } from "modals";
import { DetailsTable } from "shared";
import { getChannelTypes } from "./helpers";
import { AutopilotSwitch } from "../ConnectPage/AutopilotSwitch";
import { CHANNEL_STATUS_CLOSED } from "constants";

const messages = defineMessages({
  filterByHashPlaceholder: {
    id: "ln.channelsTab.filterByChannelPointPlaceholder",
    defaultMessage: "Filter by Channel Point"
  },
  counterpartyNodeInputLabel: {
    id: "ln.channelsTab.counterpartyNode",
    defaultMessage: "Counterparty Node"
  },
  counterpartyNodeInputPlaceholder: {
    id: "ln.channelsTab.counterpartyNodePlaceholder",
    defaultMessage: "NodePubKey@ip:port"
  },
  localAmtInputLabel: {
    id: "ln.channelsTab.localAmt",
    defaultMessage: "Amount to Commit"
  },
  localAmtInputPlaceholder: {
    id: "ln.channelsTab.localAmtPlaceholder",
    defaultMessage: "Amount of DCR to commit to channel"
  },
  pushAmountInputLabel: {
    id: "ln.channelsTab.pushAmount",
    defaultMessage: "Push Amount (optional)"
  },
  pushAmountInputPlaceholder: {
    id: "ln.channelsTab.pushAmountPlaceholder",
    defaultMessage: "Amount of DCR to push to channel"
  },
  nodeSuccessMsg: {
    id: "ln.channelsTab.nodeSuccessMsg",
    defaultMessage: "Valid PubKey"
  }
});

export const ChannelsTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.channels.description.channels"
          m="Open and pending channels of this LN Wallet"
        />
        <BalancesHeader />
      </>
    }
  />
);

const subtitleMenu = ({
  channelTypes,
  selectedChannelType,
  searchText,
  intl,
  onChangeSelectedType,
  onChangeSearchText
}) => (
  <div className={styles.filterContainer}>
    <div className={styles.channelSearch}>
      <TextInput
        newBiggerFontStyle
        className={styles.searchInput}
        id="filterByHashInput"
        type="text"
        placeholder={intl.formatMessage(messages.filterByHashPlaceholder)}
        value={searchText}
        onChange={(e) => onChangeSearchText(e.target.value)}
      />
    </div>
    <Tooltip
      contentClassName={styles.typeTooltip}
      content={<T id="ln.channelsTab.channelTypes.tooltip" m="Channel Type" />}>
      <EyeFilterMenu
        options={channelTypes}
        selected={selectedChannelType}
        onChange={onChangeSelectedType}
      />
    </Tooltip>
  </div>
);

const ChannelsTab = () => {
  const {
    channels,
    node,
    localAmtAtoms,
    pushAmtAtoms,
    opening,
    canOpen,
    isMainNet,
    recentlyOpenedChannel,
    recentNodes,
    hideSearchBt,
    autopilotEnabled,
    nodeShowSuccess,
    nodeErrorMsg,
    onAutopilotChanged,
    intl,
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
  } = useChannelsTab();

  return (
    <div className={styles.container}>
      <Subtitle
        title={<T id="ln.channelsTab.createAChannel" m="Create a Channel" />}
      />
      <AutopilotSwitch
        onChange={onAutopilotChanged}
        autopilotEnabled={autopilotEnabled}
      />
      <div className={styles.openNewChannel}>
        <div>
          <div className={styles.title}>
            <T
              id="ln.openChannel.connectTo"
              m="Connect to a Counterparty Node to create a channel and start using Lightning Network."
            />
          </div>
          <div
            className={classNames(
              styles.counterpartyWrapper,
              hideSearchBt && styles.hideSearchBt
            )}>
            <TextInput
              newBiggerFontStyle
              hideIcons
              className={styles.counterparty}
              id="counterpartyInput"
              value={node}
              inputClassNames={classNames(styles.counterpartyInput)}
              onChange={(e) => onNodeChanged(e.target.value)}
              placeholder={intl.formatMessage(
                messages.counterpartyNodeInputPlaceholder
              )}
              label={intl.formatMessage(messages.counterpartyNodeInputLabel)}
              successMessage={intl.formatMessage(messages.nodeSuccessMsg)}
              showSuccess={nodeShowSuccess}
              showErrors={!!nodeErrorMsg}
              invalid={!!nodeErrorMsg}
              invalidMessage={nodeErrorMsg}>
              {!node ? (
                <Button
                  kind="secondary"
                  size="sm"
                  className={styles.pasteButton}
                  onClick={(e) => {
                    e.preventDefault();
                    onNodeChanged(wallet.readFromClipboard());
                  }}>
                  Paste
                </Button>
              ) : (
                <Button
                  aria-label="Clear Address"
                  kind="secondary"
                  className={classNames(styles.clearAddressButton)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNodeChanged("");
                  }}>
                  <div />
                </Button>
              )}
            </TextInput>
            {!hideSearchBt && (
              <SearchForNodesButton
                className={styles.searchBt}
                onSubmit={onNodeChanged}
                recentNodes={recentNodes}
              />
            )}
          </div>
          <DcrInput
            newBiggerFontStyle
            id="localAmtAtomsInput"
            className={styles.localAmtAtomsInput}
            amount={localAmtAtoms}
            onChangeAmount={onLocalAmtChanged}
            placeholder={intl.formatMessage(messages.localAmtInputPlaceholder)}
            label={intl.formatMessage(messages.localAmtInputLabel)}
          />
          {!isMainNet && (
            <DcrInput
              newBiggerFontStyle
              id="pushAmtAtomsInput"
              className={styles.pushAmtAtomsInput}
              amount={pushAmtAtoms}
              onChangeAmount={onPushAmtChanged}
              placeholder={intl.formatMessage(
                messages.pushAmountInputPlaceholder
              )}
              label={intl.formatMessage(messages.pushAmountInputLabel)}
            />
          )}
        </div>
        <div className={styles.recentNodesContainer}>
          <div className={styles.title}>
            <T id="ln.openChannel.recentNodes" m="Recent Nodes" />
          </div>
          <ul>
            {recentNodes && recentNodes.length > 0 ? (
              recentNodes.slice(0, isMainNet ? 4 : 6).map((node) => (
                <li
                  onClick={() => onNodeChanged(node.pubKey)}
                  key={node.pubKey}>
                  {node.alias}
                </li>
              ))
            ) : (
              <T id="ln.openChannel.emptyRecentNodes" m="No nodes yet" />
            )}
          </ul>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <PiUiButton
          onClick={onOpenChannel}
          loading={opening}
          disabled={opening || !canOpen}>
          <T id="ln.openChannel.createChannelBt" m="Create Channel" />
        </PiUiButton>
      </div>

      <Subtitle
        className={styles.channelHistorySubtitle}
        title={<T id="ln.channelsTab.manageChannels" m="Manage Channels" />}
        children={subtitleMenu({
          channelTypes: getChannelTypes(),
          selectedChannelType,
          searchText,
          intl,
          onChangeSelectedType,
          onChangeSearchText
        })}
      />
      {channels.length > 0 ? (
        channels.map((c) => (
          <div
            className={classNames(
              styles.cardWrapper,
              c.localBalance >= c.remoteBalance
                ? styles.channelBlueBorder
                : styles.channelGrayBorder
            )}
            key={c.channelPoint}
            onClick={() => viewChannelDetailsHandler(c.channelPoint)}>
            <ChannelCard channel={c} />
            <div
              className={classNames(styles.continueButton, "flex-centralize")}>
              <div className={styles.continueArrow}></div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.empty}>
          <T id="ln.channelsTab.emptyChannelList" m="No channel found" />
        </div>
      )}

      {recentlyOpenedChannel && (
        <LNChannelModal
          show={!!recentlyOpenedChannel}
          onCancelModal={() => closeRecentlyOpenedChannelModal(null)}
          detailsTable={
            <DetailsTable
              data={getChannelDetails(recentlyOpenedChannel)}
              headerClassName={styles.modalDetailsHeader}
              gridClassName={styles.modalDetailsGrid}
              title={<T id="ln.channelModal.props" m="Properties" />}
            />
          }
          channelCard={
            <ChannelCard
              channel={recentlyOpenedChannel}
              className={styles.modalChanelCard}
            />
          }
          closeButton={
            recentlyOpenedChannel.status !== CHANNEL_STATUS_CLOSED && (
              <CloseChannelModalButton
                className={styles.modalCloseButton}
                modalTitle={
                  <T
                    id="ln.channelModal.closeChannelModalTitle"
                    m="Close Channel"
                  />
                }
                modalContent={
                  <CloseChannelModalContent channel={recentlyOpenedChannel} />
                }
                buttonLabel={
                  <T
                    id="ln.channelModal.closeChannelButton"
                    m="Close Channel"
                  />
                }
                onSubmit={() => onCloseChannel(recentlyOpenedChannel)}
              />
            )
          }
        />
      )}
    </div>
  );
};

export default ChannelsTab;
