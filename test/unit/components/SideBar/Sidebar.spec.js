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

const testCurrentBlockHeight = 12;

const expectToHaveDefaultMenuLinks = (params) => {
  const { sidebarOnBottom, isTrezorEnabled, isLnEnabled } = params || {};
  const expectToHaveMenuLink = (name, className, href, icon) => {
    const menulink = screen.queryByRole("link", { name: name });
    expect(menulink).toHaveTextContent(sidebarOnBottom ? "" : name);
    expect(menulink).toHaveClass(className);
    expect(menulink).toHaveAttribute("href", href);
    expect(menulink).toHaveAttribute("icon", icon);
  };

  expectToHaveMenuLink(/overview/i, "overviewIcon", "/home", "overview");
  expectToHaveMenuLink(
    /transactions/i,
    "transactionsIcon",
    "/transactions",
    "transactions"
  );
  expectToHaveMenuLink(/tickets/i, "ticketsIcon", "/tickets", "tickets");
  expectToHaveMenuLink(/accounts/i, "accountsIcon", "/accounts", "accounts");
  expectToHaveMenuLink(
    /security/i,
    "securitycntrIcon",
    "/security",
    "securitycntr"
  );
  expectToHaveMenuLink(/help/i, "helpIcon", "/help", "help");
  expectToHaveMenuLink(/settings/i, "settingsIcon", "/settings", "settings");

  if (isTrezorEnabled) {
    expectToHaveMenuLink(/trezor setup/i, "trezorIcon", "/trezor", "trezor");
  } else {
    expect(
      screen.queryByRole("link", { name: /trezor setup/i })
    ).not.toBeInTheDocument();
  }

  if (isLnEnabled) {
    expectToHaveMenuLink(/lightning network/i, "lnIcon", "/ln", "ln");
  } else {
    expect(
      screen.queryByRole("link", { name: /lightning network/i })
    ).not.toBeInTheDocument();
  }
};

const clickOnMenuLink = (name) => {
  const menuLink = screen.queryByRole("link", { name: name });
  expect(menuLink).not.toHaveClass("menuLinkActive");
  user.click(menuLink);
  expect(menuLink).toHaveClass("menuLinkActive");
};

test("renders default sidebar", () => {
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

  render(<SideBar />, {
    initialState: {
      settings: { uiAnimations: true },
      grpc: {
        balances: testBalances
      }
    }
  });

  expectToHaveDefaultMenuLinks();

  expect(
    screen.queryByRole("link", {
      name: "ln"
    })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toBeInTheDocument();

  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/watch-only/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/mixer is running/i)).not.toBeInTheDocument();
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

  //clicks tickets menu link on the sidebar
  clickOnMenuLink("Tickets");
});

test("renders sidebar on the bottom", () => {
  render(<SideBar />, {
    initialState: {
      sidebar: { sidebarOnBottom: true }
    }
  });

  expectToHaveDefaultMenuLinks({
    sidebarOnBottom: true
  });
  expect(
    screen.queryByRole("button", {
      name: /^rescan$/i
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  //clicks tickets menu link on the sidebar
  clickOnMenuLink("Tickets");

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
});

test("renders sidebar with trezor enabled", () => {
  render(<SideBar />, {
    initialState: { trezor: { enabled: true } }
  });

  expectToHaveDefaultMenuLinks({
    isTrezorEnabled: true
  });
});

test("renders sidebar on the bottom with animation enabled", () => {
  render(<SideBar />, {
    initialState: {
      sidebar: { sidebarOnBottom: true },
      settings: { uiAnimations: true }
    }
  });

  //clicks tickets menu link on the sidebar
  clickOnMenuLink("Tickets");
});

test("renders sidebar with lightning network enabled", () => {
  render(<SideBar />, {
    initialState: { ln: { enabled: true } }
  });

  expectToHaveDefaultMenuLinks({
    isLnEnabled: true
  });
});

test("renders expanded sidebar with testnet network enabled", () => {
  render(<SideBar />, {
    initialState: {
      settings: {
        currentSettings: { network: "testnet" }
      },
      sidebar: {
        expandSideBar: true
      }
    }
  });
  expect(screen.getByRole("button", { name: /logo/i })).toHaveClass("testnet");
});

test("tests rescan on the expanded sidebar", () => {
  render(<SideBar />, {
    initialState: {
      sidebar: {
        expandSideBar: true
      },
      grpc: {
        currentBlockHeight: testCurrentBlockHeight,
        recentBlockTimestamp: new Date().getTime() / 1000 - 1
      }
    }
  });

  expect(screen.getByText(/< 1 minute ago/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan-button");

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
  ).toHaveClass("rescan-button spin");

  expect(
    screen.getByRole("button", { name: /cancel rescan/i })
  ).toBeInTheDocument();
  expect(screen.queryByText(/< 1 minute ago/i)).not.toBeInTheDocument();
  expect(screen.getByText(/rescanning/i)).toBeInTheDocument();
  expect(screen.getByText(`0/${testCurrentBlockHeight}`)).toBeInTheDocument();
  expect(screen.getByText(/(0%)/i)).toBeInTheDocument();

  user.click(screen.getByRole("button", { name: /cancel rescan/i }));
  expect(mockRescanCancel).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan-button");
  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();
});

test("tests rescan on the collapsed sidebar", () => {
  render(<SideBar />, {
    initialState: {
      sidebar: {
        expandSideBar: false
      },
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
  ).toHaveClass("rescan-button");
  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();

  user.click(screen.getByRole("button", { name: /^rescan$/i }));

  expect(mockRescanAttempt).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan-button spin");
  expect(
    screen.getByRole("button", { name: /cancel rescan/i })
  ).toBeInTheDocument();

  user.click(screen.getByRole("button", { name: /cancel rescan/i }));
  expect(mockRescanCancel).toHaveBeenCalledTimes(1);

  expect(
    screen.getByRole("button", {
      name: /^rescan$/i
    })
  ).toHaveClass("rescan-button");
  expect(
    screen.queryByRole("button", { name: /cancel rescan/i })
  ).not.toBeInTheDocument();
});

test("tests tooltip on Logo when isWatchingOnly mode is active", () => {
  render(<SideBar />, {
    initialState: {
      walletLoader: {
        isWatchingOnly: true
      }
    }
  });
  expect(screen.getByText(/watch-only/i)).toMatchInlineSnapshot(`
    <span
      class="tip "
    >
      This is a watch-only wallet with limited functionality.
    </span>
  `);
});

test("tests tooltip on Logo when accountMixerRunning mode is active", () => {
  render(<SideBar />, {
    initialState: {
      grpc: {
        accountMixerRunning: true
      }
    }
  });
  expect(screen.getByText(/mixer is running/i)).toMatchInlineSnapshot(`
<span
  class="tip "
>
  The mixer is running. Go to Privacy view for more information
</span>
`);
});

test("tests notification icon on the menu link", () => {
  const mockNewProposalsStartedVoting = (sel.newProposalsStartedVoting = jest.fn(
    () => true
  ));
  render(<SideBar />);
  expect(screen.getByTestId("menu-link-notification-icon")).toBeInTheDocument();
  expect(mockNewProposalsStartedVoting).toHaveBeenCalled();
  mockNewProposalsStartedVoting.mockRestore();
});

test("tests tabbedPage location", () => {
  const { history } = render(<SideBar />);
  expect(screen.queryByRole("link", { name: /transactions/i })).not.toHaveClass(
    "menuLinkActive"
  );
  history.push("transactions/send");
  expect(screen.queryByRole("link", { name: /transactions/i })).toHaveClass(
    "menuLinkActive"
  );
});
