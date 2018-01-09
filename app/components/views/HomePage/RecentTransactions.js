// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
}) => {
  return (
    <Aux>
      {getTransactionsRequestAttempt ? <DecredLoading /> :
        <Aux>
          <div className="home-content-title">
            <div className="home-content-title-text">
              <T id="home.recentTransactionsTitle" m="Recent Transactions" />
            </div>
          </div>
          <div className="home-content-nest">
            {transactions.length > 0 ?
              <TxHistory limit={5} {...{ getAccountsResponse, transactions }} /> :
              <p><T id="home.noTransactions" m="No transactions" /></p>}
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
