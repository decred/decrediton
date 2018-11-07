import { FormattedMessage as T, FormattedRelative } from "react-intl";
import ReactTimeout from "react-timeout";

@autobind
class LastBlockTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getBlockDate(props.lastBlockTimestamp);
  }

  componentDidUpdate(prevProps) {
    const { lastBlockTimestamp } = prevProps;
    if (lastBlockTimestamp !== this.props.lastBlockTimestamp) {
      this.setState(this.getBlockDate(this.props.lastBlockTimestamp));
    }
  }

  getBlockDate(lastBlockTimestamp) {
    let lastBlockDate;
    let lastBlockIsRecent = false;
    let updateRecentTimer = this.state ? this.state.updateRecentTimer : null;

    if (lastBlockTimestamp) {
      if (updateRecentTimer) {
        this.props.clearTimeout(updateRecentTimer);
        updateRecentTimer = null;
      }

      const now = new Date();
      lastBlockDate = new Date(lastBlockTimestamp*1000);
      const timeFromLastBlock = now.getTime() - lastBlockDate.getTime();
      lastBlockIsRecent = timeFromLastBlock < 60000;
      if (lastBlockIsRecent) {
        updateRecentTimer = this.props.setTimeout(this.updateRecentBlockTime, 60000 - timeFromLastBlock);
      }
    }
    return { lastBlockDate, lastBlockIsRecent, updateRecentTimer };
  }

  updateRecentBlockTime() {
    this.setState(this.getBlockDate(this.props.lastBlockTimestamp));
  }

  render() {
    const { lastBlockDate, lastBlockIsRecent } = this.state;
    if (lastBlockDate && lastBlockIsRecent) {
      return <T id="sidebar.lastBlockIsRecent" m="< 1 minute ago" />;
    } else if (lastBlockDate) {
      return <FormattedRelative value={lastBlockDate} updateInterval={1*1000}/>;
    } else {
      return null;
    }
  }

}

LastBlockTime.propTypes = {
  lastBlockDate: PropTypes.number,
};

export { LastBlockTime as LastBlockTime };

export default ReactTimeout(LastBlockTime);
