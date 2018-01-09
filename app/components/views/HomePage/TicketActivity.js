// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  getTransactionsRequestAttempt,
}) => {
  return (
    <Aux>
      {getTransactionsRequestAttempt ? <DecredLoading /> :
        <Aux>
          <div className="home-content-title">
            <T id="home.ticketActivityTitle" m="Ticket Activity" />
          </div>
          <div className="home-content-nest">
            <p><T id="home.noTransactions" m="No available" /></p>
          </div>
        </Aux>}
    </Aux>
  );
};

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
