import Blockchain from "components/views/GovernancePage/Blockchain";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";

let mockAllAgendas;
let mockVoteChoices;
const mockViewAgendaDetailsHandler = jest.fn();

jest.mock("components/views/GovernancePage/Blockchain/hooks", () => ({
  useBlockchain: () => {
    return {
      allAgendas: mockAllAgendas,
      voteChoices: mockVoteChoices,
      viewAgendaDetailsHandler: mockViewAgendaDetailsHandler
    };
  }
}));

const testAgendaCardElements = (
  mockAgendaName,
  mockDescription,
  mockChoice,
  expectedTooltipText,
  expectedStatusText
) => {
  expect(screen.getAllByText(mockAgendaName).length).toBe(2); //one title and one agenda ID
  expect(screen.getByText("Agenda ID:").parentNode.textContent).toMatch(
    `Agenda ID: ${mockAgendaName}`
  );
  expect(screen.getByText("Preference:").parentNode.textContent).toMatch(
    `Preference: ${mockChoice}`
  );
  expect(screen.getByText(expectedTooltipText)).toBeInTheDocument();
  expect(screen.getByText(expectedStatusText)).toBeInTheDocument();

  user.click(screen.getByText(mockDescription));
  expect(mockViewAgendaDetailsHandler).toHaveBeenCalled();
};

const testAgendaCard = (
  mockChoice,
  finished,
  passed,
  expectedTooltipText,
  expectedStatusText
) => {
  const mockAgendaName = "test-agenda-name";
  const mockDescription = "test-desc-test";
  mockAllAgendas = [
    {
      description: mockDescription,
      finished: finished,
      name: mockAgendaName,
      passed: passed
    }
  ];

  mockVoteChoices = [{ agendaId: mockAgendaName, choiceId: mockChoice }];
  render(<Blockchain />);
  testAgendaCardElements(
    mockAgendaName,
    mockDescription,
    mockChoice,
    expectedTooltipText,
    expectedStatusText
  );
};

test.each([
  [
    "yes",
    true,
    true,
    "This agenda has finished voting and PASSED.",
    "Finished"
  ], // finished passed voted yes
  ["no", true, true, "This agenda has finished voting and PASSED.", "Finished"], // finished passed voted no
  [
    "abstain",
    true,
    false,
    "This agenda has finished voting and NOT PASSED.",
    "Finished"
  ], // finished passed voted abstain
  ["yes", false, null, "Voting is still in progress.", "In Progress"], // not finished voted yes
  ["no", false, null, "Voting is still in progress.", "In Progress"], // not finished voted no
  ["abstain", false, null, "Voting is still in progress.", "In Progress"] // not finished not voted yet
])("test agendaCard ( choice: %s, finished: %s, passed: %s)", testAgendaCard);

test("no agendas", () => {
  mockAllAgendas = [];
  render(<Blockchain />);
  expect(
    screen.getByText(/there are currently no agendas for voting/i)
  ).toBeInTheDocument();
});

test("test agenda search and sort controls", async () => {
  mockAllAgendas = [
    {
      name: "test-name-1",
      description: "test-desc-1"
    },
    {
      name: "test-name-12",
      description: "test-desc-12"
    },
    {
      name: "test-name-3",
      description: "test-desc-3"
    }
  ];
  render(<Blockchain />);
  expect(
    screen
      .getAllByText(/test-desc-/i)
      .map((element) => element.textContent.trim())
  ).toStrictEqual(["test-desc-1", "test-desc-12", "test-desc-3"]);

  const filterControl = screen.getByPlaceholderText("Filter by Name");

  user.type(filterControl, "1");
  expect(
    screen
      .getAllByText(/test-desc-/i)
      .map((element) => element.textContent.trim())
  ).toStrictEqual(["test-desc-1", "test-desc-12"]);

  const eyeFilterMenu = screen.getByRole("button", { name: "EyeFilterMenu" });
  user.click(eyeFilterMenu);
  user.click(screen.getByText("Oldest"));
  await wait(() =>
    expect(
      screen
        .getAllByText(/test-desc-/i)
        .map((element) => element.textContent.trim())
    ).toStrictEqual(["test-desc-12", "test-desc-1"])
  );

  user.clear(filterControl);
  user.type(filterControl, "12");
  expect(
    screen
      .getAllByText(/test-desc-/i)
      .map((element) => element.textContent.trim())
  ).toStrictEqual(["test-desc-12"]);

  user.clear(filterControl);
  user.type(filterControl, "4");
  expect(screen.queryByText(/test-desc-/i)).not.toBeInTheDocument();
  expect(
    screen.getByText(/no agendas matched your search/i)
  ).toBeInTheDocument();

  user.clear(filterControl);
  expect(
    screen
      .getAllByText(/test-desc-/i)
      .map((element) => element.textContent.trim())
  ).toStrictEqual(["test-desc-3", "test-desc-12", "test-desc-1"]);

  // Newest first
  user.click(eyeFilterMenu);
  user.click(screen.getByText("Newest"));
  await wait(() =>
    expect(
      screen
        .getAllByText(/test-desc-/i)
        .map((element) => element.textContent.trim())
    ).toStrictEqual(["test-desc-1", "test-desc-12", "test-desc-3"])
  );
});
