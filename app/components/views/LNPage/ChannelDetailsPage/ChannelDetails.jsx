import { classNames } from "pi-ui";
import styles from "./ChannelDetails.module.css";
import { FormattedMessage as T } from "react-intl";
import { useChannelDetails } from "./hooks";
import {
  ChannelCard,
  CloseChannelModalContent,
  getChannelDetails
} from "./helpers";
import { DetailsTable } from "shared";
import { CloseChannelModalButton } from "buttons";
import { CHANNEL_STATUS_CLOSED } from "constants";

const ChannelDetails = () => {
  const { channel, goBackHistory, onCloseChannel } = useChannelDetails();

  return (
    <div className={styles.container}>
      <div className={classNames(styles.cardWrapper)}>
        <div
          className={classNames(styles.backButton, "flex-centralize")}
          data-testid="goBackHistory"
          onClick={goBackHistory}>
          <div className={styles.backArrow}></div>
        </div>
        <ChannelCard {...{ channel }} />
      </div>
      <div className={styles.props}>
        <DetailsTable
          data={getChannelDetails(channel)}
          headerClassName={styles.detailsHeader}
          gridClassName={styles.detailsGrid}
          title={<T id="ln.channelDetails.props" m="Properties" />}
        />
      </div>

      {channel.status !== CHANNEL_STATUS_CLOSED && (
        <div className={styles.buttonContrainer}>
          <CloseChannelModalButton
            className={styles.closeButton}
            modalTitle={
              <T
                id="ln.channelDetails.closeChannelModalTitle"
                m="Close Channel"
              />
            }
            modalContent={<CloseChannelModalContent channel={channel} />}
            buttonLabel={
              <T id="ln.channelDetails.closeChannelButton" m="Close Channel" />
            }
            onSubmit={() => onCloseChannel(channel)}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelDetails;
