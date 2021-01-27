import { LoadingMoreTicketsIndicator } from "indicators";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";

let mockStartRequestHeight;
let mockTicketsFilter;
let mockCurrentBlockHeight;

const testStartRequestHeight = 5000;
const testTicketFilterDesc = {
  listDirection: "desc",
  status: null,
  vspFeeStatus: null
};
const testTicketFilterAsc = { ...testTicketFilterDesc, listDirection: "asc" };
const testCurrentBlockHeight = 6000;
const testClassName = "test-classname";

beforeEach(() => {
  mockStartRequestHeight = sel.startRequestHeight = jest.fn(
    () => testStartRequestHeight
  );
  mockTicketsFilter = sel.ticketsFilter = jest.fn(() => testTicketFilterDesc);
  mockCurrentBlockHeight = sel.currentBlockHeight = jest.fn(
    () => testCurrentBlockHeight
  );
});

test("test default LoadingMoreTickets", async () => {
  render(<LoadingMoreTicketsIndicator className={testClassName} />);

  expect(mockStartRequestHeight).toHaveBeenCalled();
  expect(mockTicketsFilter).toHaveBeenCalled();
  expect(mockCurrentBlockHeight).toHaveBeenCalled();

  const loadingMoreTickets = screen.getByText(/loading more tickets/i);
  expect(loadingMoreTickets.parentElement.parentElement).toHaveClass(
    testClassName
  );
  expect(
    screen.getByText(`Down to block ${testStartRequestHeight} (17%)`)
  ).toBeInTheDocument();
  expect(screen.getByText("Cancel listing tickets")).toBeInTheDocument();

  /* cancel listing Tickets */
  user.click(screen.getByRole("button"));
  await wait(() => screen.getByText(/loading more tickets canceled/i));
  expect(screen.getByText("Return listing tickets")).toBeInTheDocument();

  /* reenable listing Tickets */
  user.click(screen.getByRole("button"));
  await wait(() => screen.getByText(/loading more tickets/i));
  expect(screen.getByText("Cancel listing tickets")).toBeInTheDocument();
});

test("test asc sorted LoadingMoreTickets", () => {
  mockTicketsFilter = sel.ticketsFilter = jest.fn(() => testTicketFilterAsc);
  render(<LoadingMoreTicketsIndicator />);

  expect(mockTicketsFilter).toHaveBeenCalled();

  expect(
    screen.getByText(`Up to block ${testStartRequestHeight} (83%)`)
  ).toBeInTheDocument();
});
