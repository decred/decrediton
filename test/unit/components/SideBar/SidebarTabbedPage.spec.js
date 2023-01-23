import SideBar from "components/SideBar/SideBar";
import { render } from "test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import { screen, waitFor } from "@testing-library/react";

const defaultMenuLinkBorderColor = "border-color: rgba(249, 250, 250, 1)"; //sidebar-color
const activeMenuLinkBorderColor = "border-color: rgba(46, 216, 163, 1)";
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

test("tests tabbedPage location", async () => {
  const { history } = render(<SideBar />);
  const { menuLink } = getMenuContentByTestId("menuLinkContent-transactions");
  expect(menuLink).toHaveStyle(defaultMenuLinkBorderColor);
  history.push("transactions/send");
  await waitFor(() => expect(menuLink).toHaveStyle(activeMenuLinkBorderColor));
});
