import SideBar from "components/SideBar/SideBar";
import { render } from "test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import * as sel from "selectors";
import {
  rescanAttempt as mockRescanAttempt,
  rescanCancel as mockRescanCancel
} from "actions/ControlActions";

jest.mock("actions/ControlActions", () => {
  const RESCAN_ATTEMPT = "RESCAN_ATTEMPT";
  const RESCAN_CANCEL = "RESCAN_CANCEL";
  return {
    rescanAttempt: jest.fn(() => (dispatch) => {
      dispatch({
        request: { getBeginHeight: () => {} },
        type: RESCAN_ATTEMPT
      });
    }),
    rescanCancel: jest.fn(() => (dispatch) => {
      dispatch({
        type: RESCAN_CANCEL
      });
    }),

    RESCAN_ATTEMPT: RESCAN_ATTEMPT,
    RESCAN_CANCEL: RESCAN_CANCEL
  };
});

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

const defaultMenuLinkBorderColor = "border-color: transparent";
const activeMenuLinkBorderColor = "border-color: rgba(46, 216, 163, 1)";
const testCurrentBlockHeight = 12;
const testBalances = [
  {
    accountNumber: 0,
    accountName: "default",
    hidden: false,
    total: 143506029948
  },
  {
    accountNumber: 1,
    accountName: "test-account",
    hidden: false,
    total: 0
  },
  {
    // imported
    accountNumber: 2147483647,
    accountName: "test-account2",
    hidden: false,
    total: 103506029948
  },
  {
    //hidden
    accountNumber: 3,
    accountName: "test-account-hidden",
    hidden: true,
    total: 93506029948
  }
];
const mockBalances = (sel.balances = jest.fn(() => testBalances));
const getMenuLinkByTestId = (testId, sidebarOnBottom, expandSideBar) => {
  const menuLinkLabel = screen.getByTestId(testId);
  let menuLink = menuLinkLabel.parentNode.parentNode.parentNode;
  if (!sidebarOnBottom && expandSideBar) {
    menuLink = menuLinkLabel.parentNode.parentNode;
  }
  return {
    menuLink,
    menuLinkLabel
  };
};
const expectToHaveDefaultMenuLinks = (params) => {
  const {
    sidebarOnBottom,
    isTrezorEnabled,
    isLnEnabled = true,
    expandSideBar
  } = params || {};

  const expectToHaveMenuLink = (testId, name, className, path) => {
    const { menuLinkLabel, menuLink } = getMenuLinkByTestId(
      testId,
      sidebarOnBottom,
      expandSideBar
    );
    if (!sidebarOnBottom && expandSideBar) {
      expect(menuLinkLabel).toHaveTextContent(name);
    }
    // check tooltip
    if (!expandSideBar) {
      expect(menuLinkLabel.previousSibling).toHaveTextContent(name);
    }
    expect(menuLink).toHaveClass(className);
    // test clicking
    expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
    user.click(menuLink);
    expect(menuLink).toHaveStyle(activeMenuLinkBorderColor);
    expect(mockHistoryPush).toHaveBeenCalledWith(path);
  };

  expectToHaveMenuLink(
    "menuLinkLabel-overview",
    "Overview",
    "overviewIcon",
    "/home"
  );
  expectToHaveMenuLink(
    "menuLinkLabel-transactions",
    "On-chain Transactions",
    "transactionsIcon",
    "/transactions"
  );
  expectToHaveMenuLink(
    "menuLinkLabel-governance",
    "Governance",
    "governanceIcon",
    "/governance"
  );
  if (!sidebarOnBottom || expandSideBar) {
    expectToHaveMenuLink(
      "menuLinkLabel-tickets",
      "Staking",
      "ticketsIcon",
      "/tickets"
    );
    expectToHaveMenuLink(
      "menuLinkLabel-accounts",
      "Accounts",
      "accountsIcon",
      "/accounts"
    );
    expectToHaveMenuLink(
      "menuLinkLabel-securitycntr",
      "Privacy and Security",
      "securitycntrIcon",
      "/privacy"
    );
    if (isTrezorEnabled) {
      expectToHaveMenuLink(
        "menuLinkLabel-trezor",
        "Trezor",
        "trezorIcon",
        "/trezor"
      );
    } else {
      expect(
        screen.queryByTestId("menuLinkLabel-trezor")
      ).not.toBeInTheDocument();
    }
  }

  if (isLnEnabled) {
    expectToHaveMenuLink(
      "menuLinkLabel-ln",
      "Lightning Transactions",
      "lnIcon",
      "/ln"
    );
  } else {
    expect(screen.queryByTestId("menuLinkLabel-ln")).not.toBeInTheDocument();
  }
};

test("renders default sidebar", () => {
  render(<SideBar />);
  expectToHaveDefaultMenuLinks({
    sidebarOnBottom: false,
    expandSideBar: false
  });

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toBeInTheDocument();

  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/watch-only/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/running in the background/i)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByTestId("menu-link-notification-icon")
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole("button", { name: /reduce sidebar/i })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  // expands the sidebar
  user.click(screen.queryByRole("button", { name: /logo/i }));

  expect(screen.queryByRole("button", { name: /reduce sidebar/i })).toHaveClass(
    "reducedArrow"
  );
  expect(screen.getByRole("button", { name: /logo/i })).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // tests mouse hover on the account list
  const accountList = screen.getByTestId("account-list");
  expect(accountList).toHaveClass("extended");
  user.hover(screen.getByText(/total balance/i));
  expect(accountList).toHaveClass("extended showingAccounts");
  // checks AccountNames
  testBalances.map((balance) => {
    if (!balance["hidden"]) {
      expect(
        screen.getByText(
          balance["accountName"] == "default"
            ? "Primary Account"
            : balance["accountName"]
        )
      ).toBeInTheDocument();
    }
  });

  user.unhover(screen.getByText(/total balance/i));
  expect(accountList).not.toHaveClass("extended showingAccounts");

  // collapses the sidebar
  user.click(screen.getByRole("button", { name: /reduce sidebar/i }));

  expect(
    screen.queryByRole("button", { name: /reduce sidebar/i })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  expect(mockBalances).toHaveBeenCalled();
});

test("renders sidebar on the bottom", () => {
  const mockSidebarOnBottom = (sel.sidebarOnBottom = jest.fn(() => true));
  render(<SideBar />);

  expectToHaveDefaultMenuLinks({
    sidebarOnBottom: true
  });
  expect(
    screen.queryByRole("button", {
      name: /^rescan$/i
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  // expands the sidebar
  user.click(screen.queryByRole("button", { name: /logo/i }));

  expect(screen.getByRole("button", { name: /reduce sidebar/i })).toHaveClass(
    "reducedArrow"
  );
  expect(screen.getByRole("button", { name: /logo/i })).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // collapses the sidebar
  user.click(screen.getByRole("button", { name: /reduce sidebar/i }));

  expect(
    screen.queryByRole("button", {
      name: /^rescan$/i
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  expect(mockSidebarOnBottom).toHaveBeenCalled();
  mockSidebarOnBottom.mockRestore();
});

test("renders sidebar with trezor enabled", () => {
  const mockIsTrezor = (sel.isTrezor = jest.fn(() => true));
  render(<SideBar />);
  expectToHaveDefaultMenuLinks({
    isTrezorEnabled: true
  });

  expect(mockIsTrezor).toHaveBeenCalled();
  mockIsTrezor.mockRestore();
});

test("renders sidebar with lightning network not enabled", () => {
  const mockLnEnabled = (sel.lnEnabled = jest.fn(() => false));

  render(<SideBar />);
  expectToHaveDefaultMenuLinks({
    isLnEnabled: false
  });

  expect(mockLnEnabled).toHaveBeenCalled();
  mockLnEnabled.mockRestore();
});

test("renders expanded sidebar with testnet network enabled", () => {
  const mockIsTestNet = (sel.isTestNet = jest.fn(() => true));
  const mockExpandSideBar = (sel.expandSideBar = jest.fn(() => true));
  const mockSidebarOnBottom = (sel.sidebarOnBottom = jest.fn(() => false));
  const mockLnEnabled = (sel.lnEnabled = jest.fn(() => true));

  render(<SideBar />);
  expectToHaveDefaultMenuLinks({
    sidebarOnBottom: false,
    expandSideBar: true
  });
  expect(screen.getByRole("button", { name: /logo/i })).toHaveClass("testnet");

  expect(mockLnEnabled).toHaveBeenCalled();
  expect(mockSidebarOnBottom).toHaveBeenCalled();
  expect(mockExpandSideBar).toHaveBeenCalled();
  expect(mockIsTestNet).toHaveBeenCalled();
  mockIsTestNet.mockRestore();
  mockExpandSideBar.mockRestore();
});

test("tests rescan on the expanded sidebar", () => {
  const mockExpandSideBar = (sel.expandSideBar = jest.fn(() => true));

  render(<SideBar />, {
    initialState: {
      grpc: {
        currentBlockHeight: testCurrentBlockHeight,
        recentBlockTimestamp: new Date().getTime() / 1000 - 1
      }
    }
  });

  expect(screen.getByText(/seconds ago/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan");

  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();

  user.click(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  );
  expect(mockRescanAttempt).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan syncing");

  expect(
    screen.getByRole("button", { name: /cancel rescan/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/seconds ago/i)).not.toBeInTheDocument();
  expect(screen.getByText(/rescanning/i)).toBeInTheDocument();
  expect(screen.getByText(`0/${testCurrentBlockHeight}`)).toBeInTheDocument();
  expect(screen.getByText(/(0%)/i)).toBeInTheDocument();

  user.click(screen.getByRole("button", { name: /cancel rescan/i }));
  expect(mockRescanCancel).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan");
  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();

  expect(mockExpandSideBar).toHaveBeenCalled();
  mockExpandSideBar.mockRestore();
});

test("tests rescan on the collapsed sidebar", () => {
  const mockExpandSideBar = (sel.expandSideBar = jest.fn(() => false));

  render(<SideBar />, {
    initialState: {
      grpc: {
        currentBlockHeight: testCurrentBlockHeight,
        recentBlockTimestamp: new Date().getTime() / 1000 - 1
      }
    }
  });

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan");
  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();

  user.click(screen.getByRole("button", { name: /^rescan$/i }));

  expect(mockRescanAttempt).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan syncing");
  expect(
    screen.getByRole("button", { name: /cancel rescan/i })
  ).toBeInTheDocument();

  user.click(screen.getByRole("button", { name: /cancel rescan/i }));
  expect(mockRescanCancel).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan");
  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();

  expect(mockExpandSideBar).toHaveBeenCalled();
  mockExpandSideBar.mockRestore();
});

test("tests tooltip on Logo when isWatchingOnly mode is active", () => {
  const mockIsWatchingOnly = (sel.isWatchingOnly = jest.fn(() => true));

  render(<SideBar />);
  expect(screen.getByText(/watch-only/i)).toMatchInlineSnapshot(`
    <span
      class="tip "
    >
      This is a watch-only wallet with limited functionality.
    </span>
  `);

  expect(mockIsWatchingOnly).toHaveBeenCalled();
  mockIsWatchingOnly.mockRestore();
});

test("tests tooltip on Logo when accountMixerRunning mode is active", () => {
  const mockGetAccountMixerRunning = (sel.getRunningIndicator = jest.fn(
    () => true
  ));

  render(<SideBar />);
  expect(screen.getByText(/in the background/i)).toMatchInlineSnapshot(`
<span
  class="tip "
>
  One or more of the following decrediton's features running in the background: Privacy Mixer, Ticket Auto Buyer, Purchase Ticket Attempt
</span>
`);

  expect(mockGetAccountMixerRunning).toHaveBeenCalled();
  mockGetAccountMixerRunning.mockRestore();
});

test("tests notification icon on the menu link", () => {
  const mockNewProposalsStartedVoting = (sel.newProposalsStartedVoting = jest.fn(
    () => true
  ));
  render(<SideBar />);
  const { menuLink } = getMenuLinkByTestId("menuLinkLabel-governance");
  expect(menuLink).toHaveClass("notificationIcon");
  expect(mockNewProposalsStartedVoting).toHaveBeenCalled();
  mockNewProposalsStartedVoting.mockRestore();
});

test("tests tabbedPage location", () => {
  const { history } = render(<SideBar />);
  const { menuLink } = getMenuLinkByTestId("menuLinkLabel-transactions");
  expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
  history.push("transactions/send");
  expect(menuLink).toHaveStyle(activeMenuLinkBorderColor);
});

test("none of the menu links should be selected when clicking on the settings button", () => {
  render(<SideBar />);
  let menuLinkLabels = screen.getAllByTestId(/menuLinkLabel-/i);
  menuLinkLabels.map((menuLinkLabel) => {
    const menuLink = menuLinkLabel.parentNode.parentNode.parentNode;
    expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
  });
  const { menuLink } = getMenuLinkByTestId("menuLinkLabel-tickets");
  user.click(menuLink);

  // click on Staking
  menuLinkLabels = screen.getAllByTestId(/menuLinkLabel-/i);
  menuLinkLabels.map((menuLinkLabel) => {
    const menuLink = menuLinkLabel.parentNode.parentNode.parentNode;
    if (menuLink.textContent == "Staking") {
      expect(menuLink).toHaveStyle(activeMenuLinkBorderColor);
    } else {
      expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
    }
  });

  // click on settings
  user.click(screen.getByRole("link", { name: "settings" }));
  menuLinkLabels = screen.getAllByTestId(/menuLinkLabel-/i);
  menuLinkLabels.map((menuLinkLabel) => {
    const menuLink = menuLinkLabel.parentNode.parentNode.parentNode;
    expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
  });
});
