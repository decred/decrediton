import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  spendableTotalBalance,
  lockedTotalBalance,
  totalBalance,
}) => {
  return (
    <div className="overview-header-wrapper">
      <p>Ticket page</p>
    </div>
  );
};

export default HomePage;

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
