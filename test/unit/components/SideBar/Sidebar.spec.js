import SideBar from "components/SideBar/SideBar";
import { render } from "test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const toHaveDefaultMenuLinks = ({ sidebarOnBottom }) => {
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
};

test("render default sidebar", () => {
  render(<SideBar />);
  toHaveDefaultMenuLinks({ sidebarOnBottom: false });

  expect(
    screen.queryByRole("link", { name: "trezor" })
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "ln" })).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { class: "rescan-button" })
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

  // expand the sidebar
  user.click(logo);

  expect(screen.queryByTestId("container")).toHaveClass("sidebar");
  expect(screen.getByTestId("reduced-arrow")).toHaveClass("reducedArrow");
  expect(screen.getByTestId("logo-div")).toHaveClass("mainnet");
  expect(screen.getByText(/total balance/i)).toBeInTheDocument();

  // collapse the sidebar
  user.click(screen.getByTestId("reduced-arrow"));

  expect(logo).toHaveClass("reducedLogo");
  expect(screen.getByTestId("logo-div")).toHaveClass("hamburger");
  expect(screen.queryByTestId("reduced-arrow")).not.toBeInTheDocument();
});

test("render sidebar on bottom", () => {
  const { debug } = render(<SideBar />, {
    initialState: { sidebar: { sidebarOnBottom: true } }
  });

  toHaveDefaultMenuLinks({ sidebarOnBottom: true });
  expect(
    screen.queryByRole("button", { class: "rescan-button" })
  ).not.toBeInTheDocument();

  debug();
});
