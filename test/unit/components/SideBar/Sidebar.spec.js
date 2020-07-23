import SideBar from "components/SideBar/SideBar";
import { render } from "test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
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

const toHaveDefaultMenuLinks = (params) => {
  const { sidebarOnBottom, isTrezorEnabled, isLnEnabled } = params || {};
  const toHaveMenuLink = (name, className, href, icon) => {
    const menulink = screen.queryByTestId(icon);
    expect(menulink).toHaveTextContent(sidebarOnBottom ? "" : name);
    expect(menulink).toHaveClass(className);
    expect(menulink).toHaveAttribute("href", href);
    expect(menulink).toHaveAttribute("icon", icon);
  };

  toHaveMenuLink(/overview/i, "overviewIcon", "/home", "overview");
  toHaveMenuLink(
    /transactions/i,
    "transactionsIcon",
    "/transactions",
    "transactions"
  );
  toHaveMenuLink(/tickets/i, "ticketsIcon", "/tickets", "tickets");
  toHaveMenuLink(/accounts/i, "accountsIcon", "/accounts", "accounts");
  toHaveMenuLink(/security/i, "securitycntrIcon", "/security", "securitycntr");
  toHaveMenuLink(/help/i, "helpIcon", "/help", "help");
  toHaveMenuLink(/settings/i, "settingsIcon", "/settings", "settings");

  if (isTrezorEnabled) {
    toHaveMenuLink(/trezor setup/i, "trezorIcon", "/trezor", "trezor");
  } else {
    expect(
      screen.queryByRole("link", { name: "trezor" })
    ).not.toBeInTheDocument();
  }

  if (isLnEnabled) {
    toHaveMenuLink(/lightning network/i, "lnIcon", "/ln", "ln");
  } else {
    expect(screen.queryByRole("link", { name: "ln" })).not.toBeInTheDocument();
  }
};

const clickOnMenuLink = (testid) => {
  const menuLink = screen.queryByTestId(testid);
  expect(menuLink).not.toHaveClass("menuLinkActive");
  user.click(menuLink);
  expect(menuLink).toHaveClass("menuLinkActive");
};

test("render default sidebar", () => {
  render(<SideBar />, {
    initialState: {
      settings: { uiAnimations: true }
    }
  });
  toHaveDefaultMenuLinks();

  expect(
    screen.queryByRole("link", {
      name: "ln"
    })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      class: "rescan-button"
    })
  ).toBeInTheDocument();

  expect(screen.queryByTestId("container")).toHaveClass(
    "sidebar sidebarReduced"
  );
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  // expect logo is a hamburger icon
  const logo = screen.queryByTestId("logo");
  expect(logo).toHaveClass("reducedLogo");
  expect(screen.getByTestId("logo-div")).toHaveClass("hamburger");
  expect(screen.queryByTestId("reduced-arrow")).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  // expand the sidebar
  user.click(logo);

  expect(screen.queryByTestId("container")).toHaveClass("sidebar");
  expect(screen.getByTestId("reduced-arrow")).toHaveClass("reducedArrow");
  expect(screen.getByTestId("logo-div")).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // test mouse hover on account list
  const accountList = screen.getByTestId("account-list");
  expect(accountList).toHaveClass("extended");
  const totalBalanceContainer = screen.getByTestId("total-balance-container");
  user.hover(totalBalanceContainer);
  expect(accountList).toHaveClass("extended showingAccounts");
  user.unhover(totalBalanceContainer);
  expect(accountList).toHaveClass("extended");

  // collapse the sidebar
  user.click(screen.getByTestId("reduced-arrow"));

  expect(logo).toHaveClass("reducedLogo");
  expect(screen.getByTestId("logo-div")).toHaveClass("hamburger");
  expect(screen.queryByTestId("reduced-arrow")).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

  //click tickets menu link on sidebar
  clickOnMenuLink("tickets");
});

test("render sidebar on bottom", () => {
  render(<SideBar />, {
    initialState: {
      sidebar: { sidebarOnBottom: true }
    }
  });

  toHaveDefaultMenuLinks({
    sidebarOnBottom: true
  });
  expect(
    screen.queryByRole("button", {
      class: "rescan-button"
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();
  const logo = screen.queryByTestId("logo");
  expect(logo).toHaveClass("reducedLogo");

  //click tickets menu link on sidebar
  clickOnMenuLink("tickets");

  // expand the sidebar
  user.click(logo);

  expect(screen.getByTestId("reduced-arrow")).toHaveClass("reducedArrow");
  expect(screen.getByTestId("logo-div")).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // collapse the sidebar
  user.click(screen.getByTestId("reduced-arrow"));

  expect(
    screen.queryByRole("button", {
      class: "rescan-button"
    })
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();
  expect(logo).toHaveClass("reducedLogo");
});

test("render sidebar with trezor enabled", () => {
  render(<SideBar />, {
    initialState: { trezor: { enabled: true } }
  });

  toHaveDefaultMenuLinks({
    isTrezorEnabled: true
  });
});

test("render sidebar on bottom with animation enabled", () => {
  render(<SideBar />, {
    initialState: {
      sidebar: { sidebarOnBottom: true },
      settings: { uiAnimations: true }
    }
  });

  //click tickets menu link on sidebar
  clickOnMenuLink("tickets");
});

test("render sidebar with lightning network enabled", () => {
  render(<SideBar />, {
    initialState: { ln: { enabled: true } }
  });

  toHaveDefaultMenuLinks({
    isLnEnabled: true
  });
});

test("render expanded sidebar with testnet network enabled", () => {
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
  expect(screen.getByTestId("logo-div")).toHaveClass("testnet");
});

test("test rescan on expanded sidebar", () => {
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
  expect(screen.getByTestId("rescan-button")).toHaveClass("rescan-button");
  expect(screen.queryByTestId("rescan-cancel-button")).not.toBeInTheDocument();

  user.click(screen.getByTestId("rescan-button"));
  expect(mockRescanAttempt).toHaveBeenCalledTimes(1);

  expect(screen.getByTestId("rescan-button")).toHaveClass("rescan-button spin");
  expect(screen.getByTestId("rescan-cancel-button")).toBeInTheDocument();
  expect(screen.queryByText(/< 1 minute ago/i)).not.toBeInTheDocument();
  expect(screen.getByText(/rescanning/i)).toBeInTheDocument();
  expect(screen.getByText(`0/${testCurrentBlockHeight}`)).toBeInTheDocument();
  expect(screen.getByText(/(0%)/i)).toBeInTheDocument();

  user.click(screen.getByTestId("rescan-cancel-button"));
  expect(mockRescanCancel).toHaveBeenCalledTimes(1);

  expect(screen.getByTestId("rescan-button")).toHaveClass("rescan-button");
  expect(screen.queryByTestId("rescan-cancel-button")).not.toBeInTheDocument();
});


test("test rescan on collapsed sidebar", () => {
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

  expect(screen.getByTestId("rescan-button")).toHaveClass("rescan-button");
  expect(screen.queryByTestId("rescan-cancel-button")).not.toBeInTheDocument();

  user.click(screen.getByTestId("rescan-button"));
  expect(mockRescanAttempt).toHaveBeenCalledTimes(1);

  expect(screen.getByTestId("rescan-button")).toHaveClass("rescan-button spin");
  expect(screen.getByTestId("rescan-cancel-button")).toBeInTheDocument();

  user.click(screen.getByTestId("rescan-cancel-button"));
  expect(mockRescanCancel).toHaveBeenCalledTimes(1);

  expect(screen.getByTestId("rescan-button")).toHaveClass("rescan-button");
  expect(screen.queryByTestId("rescan-cancel-button")).not.toBeInTheDocument();
});
