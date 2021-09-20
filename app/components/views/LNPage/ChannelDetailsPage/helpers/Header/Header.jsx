import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { LN_ICON } from "constants";
import BalancesHeader from "../../../BalancesHeader";

const Header = React.memo(function Header() {
  return (
    <StandaloneHeader
      title={<T id="ln.channeldetails.title" m="Lightning Network" />}
      description={
        <>
          <T
            id="ln.channeldetails.description.channels"
            m="Open and pending channels of this LN Wallet"
          />
          <BalancesHeader />
        </>
      }
      iconType={LN_ICON}
    />
  );
});

export default Header;
