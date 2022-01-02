import { TabbedPage, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { ConnectPage } from "./ConnectPage";
import { AdvancedTab, AdvancedTabHeader } from "./AdvancedTab";
import { ChannelsTab, ChannelsTabHeader } from "./ChannelsTab";
import { ReceiveTab, ReceiveTabHeader } from "./ReceiveTab";
import { SendTab, SendTabHeader } from "./SendTab";
import { OverviewTab, OverviewTabHeader } from "./OverviewTab";
import { LN_ICON } from "constants";
import { useLNPage } from "./hooks";

const LNPageHeader = () => (
  <TitleHeader
    iconType={LN_ICON}
    title={<T id="ln.title" m="Lightning Network" />}
  />
);

const tabs = [
  {
    path: "/ln/overview",
    content: OverviewTab,
    header: OverviewTabHeader,
    label: <T id="ln.tab.overview" m="Overview" />
  },
  {
    path: "/ln/channels",
    content: ChannelsTab,
    header: ChannelsTabHeader,
    label: <T id="ln.tab.channels" m="Channels" />
  },
  {
    path: "/ln/payments",
    content: SendTab,
    header: SendTabHeader,
    label: <T id="ln.tab.send" m="Send" />
  },
  {
    path: "/ln/invoices",
    content: ReceiveTab,
    header: ReceiveTabHeader,
    label: <T id="ln.tab.receive" m="Receive" />
  },
  {
    path: "/ln/advanced",
    content: AdvancedTab,
    header: AdvancedTabHeader,
    label: <T id="ln.tab.advanced" m="Advanced" />
  }
];

const LNActivePage = () => <TabbedPage header={<LNPageHeader />} tabs={tabs} />;

const LNPage = () => {
  const { lnActive } = useLNPage();

  return lnActive ? <LNActivePage /> : <ConnectPage />;
};

export default LNPage;
