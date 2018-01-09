// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import { Balance, TabbedHeader } from "shared";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  routes,
  spendableTotalBalance,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
}) => {
  return (
    <Aux>
      <TabbedHeader {...{ routes }}>
        <div className="overview-balance">
          <Balance amount={spendableTotalBalance} large/>
        </div>
      </TabbedHeader>
      { getTransactionsRequestAttempt ? <div className="page-content"><DecredLoading /></div> :
      <div className="page-content">
        <div className="home-content-title">
          <div className="home-content-title-text">
            <T id="home.recentTransactionsTitle" m="Recent Transactions" />
          </div>
        </div>
        <div className="home-content-nest">
          { transactions.length > 0 ?
          <TxHistory {...{ getAccountsResponse, transactions }} /> :
          <p><T id="home.noTransactions" m="No transactions" /></p> }
        </div>
      </div> }
    </Aux>
  );
};

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
