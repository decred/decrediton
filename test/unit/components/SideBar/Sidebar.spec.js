import SideBar from "components/SideBar/SideBar";
import { render } from "test-utils.js";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import * as sel from "selectors";
import {
  rescanAttempt as mockRescanAttempt,
  rescanCancel as mockRescanCancel
} from "actions/ControlActions";

const selectors = sel;

jest.mock("actions/ControlActions", () => {
  const RESCAN_ATTEMPT = "RESCAN_ATTEMPT";
  const RESCAN_CANCEL = "RESCAN_CANCEL";
  return {
    rescanAttempt: jest.fn(() => (dispatch) => {
      dispatch({
        request: { beginHeight: () => {} },
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

const defaultMenuLinkBorderColor = "border-color: rgba(249, 250, 250, 1)"; //sidebar-color
const activeMenuLinkBorderColor = "border-color: #2ed8a3";
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
const mockBalances = (selectors.balances = jest.fn(() => testBalances));
const getMenuContentByTestId = (testId, sidebarOnBottom, expandSideBar) => {
  const menuLinkContent = screen.getByTestId(testId);
  let menuLink = menuLinkContent.parentNode.parentNode.parentNode;
  if (!sidebarOnBottom && expandSideBar) {
    menuLink = menuLinkContent.parentNode.parentNode;
  }
  return {
    menuLink,
    menuLinkContent
  };
};
const expectToHaveDefaultMenuLinks = async (user, params) => {
  const {
    sidebarOnBottom,
    isTrezorEnabled,
    isLnEnabled = true,
    expandSideBar
  } = params || {};

  const expectToHaveMenuLink = async (
    testId,
    name,
    className,
    path,
    tooltip,
    disabled
  ) => {
    const { menuLinkContent, menuLink } = getMenuContentByTestId(
      testId,
      sidebarOnBottom,
      expandSideBar
    );
    if (!sidebarOnBottom && expandSideBar) {
      expect(menuLinkContent).toHaveTextContent(name);
    }
    // check tooltip
    if (!expandSideBar) {
      expect(menuLinkContent.previousSibling).toHaveTextContent(tooltip);
    }
    expect(menuLinkContent.firstChild).toHaveClass(className);
    // test clicking
    expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
    fireEvent.click(menuLink);
    await waitFor(() => {
      if (disabled) {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(path);
      } else {
        expect(mockHistoryPush).toHaveBeenCalledWith(path);
      }
    });
  };

  await expectToHaveMenuLink(
    "menuLinkContent-overview",
    "Overview",
    "overviewIcon",
    "/home",
    "Overview"
  );
  await expectToHaveMenuLink(
    "menuLinkContent-transactions",
    "On-chain Transactions",
    "transactionsIcon",
    "/transactions",
    "On-chain Transactions"
  );
  if (!sidebarOnBottom || expandSideBar) {
    await expectToHaveMenuLink(
      "menuLinkContent-accounts",
      "Accounts",
      "accountsIcon",
      "/accounts",
      "Accounts"
    );
    await expectToHaveMenuLink(
      "menuLinkContent-securitycntr",
      "Privacy and Security",
      "securitycntrIcon",
      "/privacy",
      "Privacy and Security"
    );
    expect(
      screen.queryByTestId("menuLinkContent-trezor")
    ).not.toBeInTheDocument();

    if (!isTrezorEnabled) {
      await expectToHaveMenuLink(
        "menuLinkContent-dex",
        "DEX",
        "dexIcon",
        "/dex",
        "DEX"
      );
      await expectToHaveMenuLink(
        "menuLinkContent-tickets",
        "Staking",
        "ticketsIcon",
        "/tickets",
        "Staking"
      );
      await expectToHaveMenuLink(
        "menuLinkContent-governance",
        "Governance",
        "governanceIcon",
        "/governance",
        "Governance"
      );
    }
  }
  if (isLnEnabled) {
    await expectToHaveMenuLink(
      "menuLinkContent-ln",
      "Lightning Transactions",
      "lnIcon",
      "/ln",
      "Lightning Transactions"
    );
  } else {
    expect(screen.queryByTestId("menuLinkContent-ln")).not.toBeInTheDocument();
  }
};

test("render default sidebar", async () => {
  const { user } = render(<SideBar />);
  expectToHaveDefaultMenuLinks(user, {
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
  await user.click(screen.queryByRole("button", { name: /logo/i }));

  expect(screen.queryByRole("button", { name: /reduce sidebar/i })).toHaveClass(
    "reducedArrow"
  );
  expect(screen.getByRole("button", { name: /logo/i })).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // tests mouse hover on the account list
  const accountList = screen.getByTestId("account-list");
  expect(accountList).toHaveClass("extended");
  user.hover(screen.getByText(/total balance/i));
  await waitFor(() =>
    expect(accountList).toHaveClass("extended showingAccounts")
  );
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

  await user.unhover(screen.getByText(/total balance/i));
  await waitFor(() =>
    expect(accountList).not.toHaveClass("extended showingAccounts")
  );

  // collapses the sidebar
  await user.click(screen.getByRole("button", { name: /reduce sidebar/i }));

  expect(
    screen.queryByRole("button", { name: /reduce sidebar/i })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  expect(mockBalances).toHaveBeenCalled();
});

test("renders sidebar on the bottom", async () => {
  const mockSidebarOnBottom = (selectors.sidebarOnBottom = jest.fn(() => true));
  const { user } = render(<SideBar />);

  await expectToHaveDefaultMenuLinks(user, {
    sidebarOnBottom: true
  });
  expect(
    screen.queryByRole("button", {
      name: /^rescan$/i
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  // expands the sidebar
  await user.click(screen.queryByRole("button", { name: /logo/i }));

  expect(screen.getByRole("button", { name: /reduce sidebar/i })).toHaveClass(
    "reducedArrow"
  );
  expect(screen.getByRole("button", { name: /logo/i })).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // collapses the sidebar
  await user.click(screen.getByRole("button", { name: /reduce sidebar/i }));

  expect(
    screen.queryByRole("button", {
      name: /^rescan$/i
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  expect(mockSidebarOnBottom).toHaveBeenCalled();
  mockSidebarOnBottom.mockRestore();
});

test("renders sidebar with trezor enabled, should not find trezor menu,\
  it have been moved to a separate tab under settings. Governance and Tickets\
  should be hidden.", async () => {
  const mockIsTrezor = (selectors.isTrezor = jest.fn(() => true));
  const { user } = render(<SideBar />);
  await expectToHaveDefaultMenuLinks(user, {
    isTrezorEnabled: true
  });

  expect(mockIsTrezor).toHaveBeenCalled();
  mockIsTrezor.mockRestore();
});

test("renders sidebar with lightning network not enabled", async () => {
  const mockLnEnabled = (selectors.lnEnabled = jest.fn(() => false));

  const { user } = render(<SideBar />);
  await expectToHaveDefaultMenuLinks(user, {
    isLnEnabled: false
  });

  expect(mockLnEnabled).toHaveBeenCalled();
  mockLnEnabled.mockRestore();
});

test("renders expanded sidebar with testnet network enabled", async () => {
  const mockIsTestNet = (selectors.isTestNet = jest.fn(() => true));
  const mockExpandSideBar = (selectors.expandSideBar = jest.fn(() => true));
  const mockSidebarOnBottom = (selectors.sidebarOnBottom = jest.fn(
    () => false
  ));
  const mockLnEnabled = (selectors.lnEnabled = jest.fn(() => true));

  const { user } = render(<SideBar />);
  await expectToHaveDefaultMenuLinks(user, {
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

test("tests rescan on the expanded sidebar", async () => {
  const mockExpandSideBar = (selectors.expandSideBar = jest.fn(() => true));

  const { user } = render(<SideBar />, {
    initialState: {
      grpc: {
        currentBlockHeight: testCurrentBlockHeight,
        recentBlockTimestamp: new Date().getTime() / 1000 - 1
      }
    }
  });

  await waitFor(() =>
    expect(screen.getByText(/seconds ago/i)).toBeInTheDocument()
  );
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
  await waitFor(() => {
    expect(mockRescanAttempt).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /cancel rescan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^rescan$/i
      })
    ).toHaveClass("rescan", "syncing");
  });

  expect(screen.queryByText(/seconds ago/i)).not.toBeInTheDocument();
  expect(screen.getByText(/^Rescanning/)).toBeInTheDocument();
  expect(screen.getByText(`0/${testCurrentBlockHeight}`)).toBeInTheDocument();
  expect(screen.getByText(/(0%)/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /cancel rescan/i }));
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

test("tests rescan on the collapsed sidebar", async () => {
  const mockExpandSideBar = (selectors.expandSideBar = jest.fn(() => false));

  const { user } = render(<SideBar />, {
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

  await user.click(screen.getByRole("button", { name: /^rescan$/i }));

  expect(mockRescanAttempt).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan syncing");
  expect(
    screen.getByRole("button", { name: /cancel rescan/i })
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /cancel rescan/i }));
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
  const mockIsWatchingOnly = (selectors.isWatchingOnly = jest.fn(() => true));

  render(<SideBar />);
  expect(screen.getByText(/watch-only/i).textContent).toMatchInlineSnapshot(
    '"This is a watch-only wallet with limited functionality."'
  );

  expect(mockIsWatchingOnly).toHaveBeenCalled();
  mockIsWatchingOnly.mockRestore();
});

test("tests tooltip on Logo when accountMixerRunning mode is active", () => {
  const mockGetAccountMixerRunning = (selectors.getRunningIndicator = jest.fn(
    () => true
  ));

  render(<SideBar />);
  expect(screen.getByText(/in the background/i).textContent)
    .toMatchInlineSnapshot(`
    "One or more of the following Decrediton features is running in
                  the background: Privacy Mixer, Ticket Auto Buyer, Purchase Ticket
                  Attempt"
  `);

  expect(mockGetAccountMixerRunning).toHaveBeenCalled();
  mockGetAccountMixerRunning.mockRestore();
});

test("tests notification icon on the menu link", () => {
  const mockNewProposalsStartedVoting = (selectors.newProposalsStartedVoting =
    jest.fn(() => true));
  render(<SideBar />);
  const { menuLink } = getMenuContentByTestId("menuLinkContent-governance");
  expect(menuLink).toHaveClass("notificationIcon");
  expect(mockNewProposalsStartedVoting).toHaveBeenCalled();
  mockNewProposalsStartedVoting.mockRestore();
});

test("tests notification icon on the menu link (newNotYetVotedAgendasCount)", () => {
  const mockNewNotYetVotedAgendasCount = (selectors.newNotYetVotedAgendasCount =
    jest.fn(() => 3));
  render(<SideBar />);
  const { menuLink } = getMenuContentByTestId("menuLinkContent-governance");
  expect(menuLink).toHaveClass("notificationIcon");
  expect(mockNewNotYetVotedAgendasCount).toHaveBeenCalled();
  mockNewNotYetVotedAgendasCount.mockRestore();
});

test("tests notification icon on the menu link (newNotYetVotedActiveProposalsCount)", () => {
  const mockNewNotYetVotedActiveProposalsCount =
    (selectors.newNotYetVotedActiveProposalsCount = jest.fn(() => 3));
  render(<SideBar />);
  const { menuLink } = getMenuContentByTestId("menuLinkContent-governance");
  expect(menuLink).toHaveClass("notificationIcon");
  expect(mockNewNotYetVotedActiveProposalsCount).toHaveBeenCalled();
  mockNewNotYetVotedActiveProposalsCount.mockRestore();
});

test("none of the menu links should be selected when clicking on the settings button", async () => {
  render(<SideBar />);
  let menuLinkContents = screen.getAllByTestId(/menuLinkContent-/i);
  menuLinkContents.map((menuLinkContent) => {
    const menuLink = menuLinkContent.parentNode.parentNode.parentNode;
    expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
  });
  const { menuLink } = getMenuContentByTestId("menuLinkContent-tickets");
  fireEvent.click(menuLink);

  // click on Staking
  menuLinkContents = screen.getAllByTestId(/menuLinkContent-/i);
  menuLinkContents.forEach(async (menuLinkContent) => {
    const menuLink = menuLinkContent.parentNode.parentNode.parentNode;
    if (menuLink.textContent == "Staking") {
      await waitFor(() =>
        expect(menuLink).toHaveStyle(activeMenuLinkBorderColor)
      );
    } else {
      await waitFor(() =>
        expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor)
      );
    }
  });

  // click on settings
  fireEvent.click(screen.getByRole("link", { name: "settings" }));
  menuLinkContents = screen.getAllByTestId(/menuLinkContent-/i);
  await waitFor(() =>
    menuLinkContents.map((menuLinkContent) => {
      const menuLink = menuLinkContent.parentNode.parentNode.parentNode;
      expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
    })
  );
});
