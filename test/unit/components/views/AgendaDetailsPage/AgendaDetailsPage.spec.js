import AgendaDetailsPage from "components/views/AgendaDetailsPage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";

let mockAllAgendas;
let mockVoteChoices;
const mockViewAgendaDetailsHandler = jest.fn();
const mockSetSelectedChoice = jest.fn();
let mockIsLoading = false;

const mockChoices = [
  { choiceId: "abstain" },
  { choiceId: "no" },
  { choiceId: "yes" }
];
let mockSelectedChoice;

jest.mock("components/views/GovernancePage/Blockchain/hooks", () => ({
  useBlockchain: () => {
    return {
      allAgendas: mockAllAgendas,
      voteChoices: mockVoteChoices,
      viewAgendaDetailsHandler: mockViewAgendaDetailsHandler
    };
  }
}));

jest.mock("components/views/AgendaDetailsPage/hooks", () => ({
  useAgendaDetails: () => ({
    allAgendas: mockAllAgendas,
    agenda: mockAllAgendas[0],
    voteChoices: mockVoteChoices,
    choices: mockChoices,
    selectedChoice: mockSelectedChoice,
    newSelectedChoice: mockSelectedChoice,
    setNewSelectedChoice: mockSetSelectedChoice,
    isLoading: mockIsLoading
  })
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
  expect(screen.getByText(mockDescription)).toBeInTheDocument();
};

/* AgendaDetailsPage */

const testAgendaDetailsPage = async (
  mockChoice,
  finished,
  passed,
  expectedTooltipText,
  expectedStatusText,
  expectedVotedText,
  isLoading = false
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
  mockSelectedChoice = mockChoice;
  mockIsLoading = isLoading;

  render(<AgendaDetailsPage />);
  testAgendaCardElements(
    mockAgendaName,
    mockDescription,
    mockChoice,
    expectedTooltipText,
    expectedStatusText
  );
  expect(screen.getByText(expectedVotedText)).toBeInTheDocument();

  const yesButton = screen.getByRole("radio", { name: "yes" });
  const noButton = screen.getByRole("radio", { name: "no" });
  const abstainButton = screen.getByRole("radio", { name: "abstain" });
  expect(yesButton.disabled).toBe(finished || isLoading);
  expect(noButton.disabled).toBe(finished || isLoading);
  expect(abstainButton.disabled).toBe(finished || isLoading);

  expect(screen.getByRole("radio", { name: mockChoice }).checked).toBe(true);

  if (!finished && !isLoading && mockChoice != "yes") {
    await user.click(yesButton);
    expect(mockSetSelectedChoice).toHaveBeenCalledWith("yes");
  }
};

test.each([
  [
    "yes",
    true,
    true,
    "This agenda has finished voting and PASSED.",
    "Finished",
    "Voted for:"
  ], // finished passed voted yes
  [
    "no",
    true,
    true,
    "This agenda has finished voting and PASSED.",
    "Finished",
    "Voted for:"
  ], // finished passed voted no
  [
    "abstain",
    true,
    false,
    "This agenda has finished voting and NOT PASSED.",
    "Finished",
    "Voted for:"
  ], // finished passed voted abstain
  [
    "yes",
    false,
    null,
    "Voting is still in progress.",
    "In Progress",
    "Voting for:"
  ], // not finished voted yes
  [
    "no",
    false,
    null,
    "Voting is still in progress.",
    "In Progress",
    "Voting for:"
  ], // not finished voted no
  [
    "abstain",
    false,
    null,
    "Voting is still in progress.",
    "In Progress",
    "Voting for:"
  ], // not finished not voted yet
  [
    "abstain",
    false,
    null,
    "Voting is still in progress.",
    "In Progress",
    "Voting for:",
    true
  ] // not finished not voted yet in loading state. controls should be disabled
])(
  "test agendaDetailsPage ( choice: %s, finished: %s, passed: %s)",
  testAgendaDetailsPage
);
