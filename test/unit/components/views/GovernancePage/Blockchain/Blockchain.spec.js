import Blockchain from "components/views/GovernancePage/Blockchain";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
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
