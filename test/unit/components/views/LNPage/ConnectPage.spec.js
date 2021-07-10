import { ConnectPage } from "components/views/LNPage/ConnectPage";
import { render } from "test-utils.js";
// import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
// import * as sel from "selectors";
// import * as ca from "actions/ControlActions";
// import * as wl from "wallet";
// import { DCR } from "constants";
// import { fireEvent } from "@testing-library/react";
// import copy from "clipboard-copy";
// jest.mock("clipboard-copy");
// export const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";

test("test ConnectPage", () => {
  render(<ConnectPage />);
});
