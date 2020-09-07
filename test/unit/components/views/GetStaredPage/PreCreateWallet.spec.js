import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";

beforeEach(() => {
  sel.getDaemonSynced = jest.fn(() => true);
  sel.isSPV = jest.fn(() => false);
  wla.getSelectedWallet = jest.fn(() => () => null);
  sel.maxWalletCount = jest.fn(() => 3);
});

test("render empty wallet chooser view and click on create wallet", async () => {
  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  debug();
  // todo test create wallet
  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("render empty wallet chooser view and click on restore wallet", async () => {
  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  debug();
  // todo test create wallet
  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});
