import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { Subtitle } from "shared";
import { PiUiButton, EyeFilterMenu, CloseChannelModalButton } from "buttons";
import { TextInput, DcrInput } from "inputs";
import { DescriptionHeader } from "layout";
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
      <div className={styles.openNewChannel}>
        <div className={styles.node}>
          <TextInput
            newBiggerFontStyle
            className={styles.counterpartyInput}
            id="counterpartyInput"
            value={node}
            onChange={onNodeChanged}
            placeholder={intl.formatMessage(
              messages.counterpartyNodeInputPlaceholder
            )}
            label={intl.formatMessage(messages.counterpartyNodeInputLabel)}
          />
        </div>
        <div>
          <DcrInput
            newBiggerFontStyle
            id="localAmtAtomsInput"
            amount={localAmtAtoms}
            onChangeAmount={onLocalAmtChanged}
            placeholder={intl.formatMessage(messages.localAmtInputPlaceholder)}
            label={intl.formatMessage(messages.localAmtInputLabel)}
          />
        </div>
        {!isMainNet && (
          <div>
            <DcrInput
              newBiggerFontStyle
              id="pushAmtAtomsInput"
              amount={pushAmtAtoms}
              onChangeAmount={onPushAmtChanged}
              placeholder={intl.formatMessage(
                messages.pushAmountInputPlaceholder
              )}
              label={intl.formatMessage(messages.pushAmountInputLabel)}
            />
          </div>
        )}
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
              c.active ? styles.channelActive : styles.channelInactive
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
            recentlyOpenedChannel.active && (
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
