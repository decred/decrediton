import {
  DecredLoading,
  LinearProgressSmall,
  StakeyBounce,
  StakeyBounceXs,
  StepIndicator,
  LoadingMoreTransactionsIndicator,
  NoMoreTransactionsIndicator,
  NoStats,
  NoTransactions,
  NoTicketsIndicator,
  NoMoreTicketsIndicator,
  NoProposals,
  PoliteiaLoading,
  VotingProgress
} from "indicators";
import { render as lightRender } from "@testing-library/react";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

const testClassName = "test-className";

test("render default DecredLoading with className prop", () => {
  lightRender(<DecredLoading className={testClassName} />);
  const decredLoading = screen.getByTestId("decred-loading");
  expect(decredLoading.className).toMatch(testClassName);
  expect(decredLoading.className).not.toMatch("hidden");
});

test("render hidden DecredLoading without className prop", () => {
  lightRender(<DecredLoading hidden />);
  const decredLoading = screen.getByTestId("decred-loading");
  expect(decredLoading.className).not.toMatch(testClassName);
  expect(decredLoading.className).toMatch("hidden");
});

test("render LinearProgressSmall", () => {
  lightRender(
    <LinearProgressSmall
      value="30"
      min="10"
      max="50"
      className={testClassName}
      barClassName={testClassName}
    />
  );
  const linearProgressSmall = screen.getByTestId("linear-prgress-small");
  expect(linearProgressSmall.className).toMatch(testClassName);
  expect(linearProgressSmall.firstElementChild.style.width).toBe("50%");
  expect(linearProgressSmall.firstElementChild.className).toMatch(
    testClassName
  );
});

test("render StakeyBounce", () => {
  lightRender(<StakeyBounce />);
  const stakeyBounce = screen.getByTestId("stakey-bounce");
  expect(stakeyBounce.className).not.toMatch("center");
});

test("render centered StakeyBounce", () => {
  lightRender(<StakeyBounce center />);
  const stakeyBounce = screen.getByTestId("stakey-bounce");
  expect(stakeyBounce.className).toMatch("center");
});

test("render StakeyBounceXs", () => {
  lightRender(<StakeyBounceXs />);
  const stakeyBounceXs = screen.getByTestId("stakey-bounce-xs");
  expect(stakeyBounceXs.className).toMatch("stakeyBounceXs");
  expect(stakeyBounceXs.firstElementChild.className).toMatch("stakeyBounce");
});

test("render StepIndicator", async () => {
  const mockOnGotoPage = jest.fn(() => {});
  const testCurrentPageIndex = 2;
  const testPageCount = 4;
  lightRender(
    <StepIndicator
      currentPageIndex={testCurrentPageIndex}
      pageCount={testPageCount}
      onGotoPage={mockOnGotoPage}
    />
  );
  const steps = screen.getAllByRole("button");
  let uncheckedStepIndicator;
  let uncheckedStepIndicatorIndex;

  steps.map((step, index) => {
    if (index < testCurrentPageIndex) {
      expect(step.className).toMatch("checked");
    } else if (index == testCurrentPageIndex) {
      expect(step.className).toMatch("current");
    } else {
      expect(step.className).toMatch("unchecked");
      uncheckedStepIndicator = step;
      uncheckedStepIndicatorIndex = index;
    }
  });

  await user.click(uncheckedStepIndicator);
  expect(mockOnGotoPage).toHaveBeenCalledWith(uncheckedStepIndicatorIndex);
});

test("render default LoadingMoreTransactionsIndicator", () => {
  lightRender(<LoadingMoreTransactionsIndicator />);
  expect(
    screen.getByText(/loading more transactions/i).textContent
  ).toMatchInlineSnapshot('"Loading more transactions..."');
});

test("render default NoMoreTransactions", () => {
  lightRender(<NoMoreTransactionsIndicator />);
  expect(
    screen.getByText(/no more transactions/i).textContent
  ).toMatchInlineSnapshot('"No more transactions."');
});

test("render default NoStats", () => {
  lightRender(<NoStats />);
  expect(
    screen.getByText(/no statistics available/i).textContent
  ).toMatchInlineSnapshot('"No Statistics Available"');
});

test("render default NoTransactions", () => {
  lightRender(<NoTransactions />);
  expect(
    screen.getByText(/no transactions found/i).textContent
  ).toMatchInlineSnapshot('"No Transactions Found"');
});

test("render default NoTicketsIndicator", () => {
  lightRender(<NoTicketsIndicator />);
  expect(
    screen.getByText(/no tickets found/i).textContent
  ).toMatchInlineSnapshot('"No Tickets Found"');
});

test("render default NoMoreTicketsIndicator", () => {
  lightRender(<NoMoreTicketsIndicator />);
  expect(
    screen.getByText(/no more tickets/i).textContent
  ).toMatchInlineSnapshot('"No More Tickets"');
});

test("render default NoProposals", () => {
  lightRender(<NoProposals />);
  expect(
    screen.getByText(/no proposals available/i).textContent
  ).toMatchInlineSnapshot('"No Proposals Available"');
});

test("render default PoliteiaLoading", () => {
  const { container } = lightRender(<PoliteiaLoading />);
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="politeiaLoading"
      />
    </div>
  `);
});

test("render VotingProgress without voteCounts", () => {
  const testQuorumMinimumVotes = 4;
  lightRender(<VotingProgress quorumMinimumVotes={testQuorumMinimumVotes} />);
  expect(screen.queryByTestId("voting-progress")).not.toBeInTheDocument();
});

test("render default VotingProgress", () => {
  const testVoteCounts = { yes: 2, no: 3 };
  const testQuorumMinimumVotes = 4;
  lightRender(
    <VotingProgress
      voteCounts={testVoteCounts}
      quorumMinimumVotes={testQuorumMinimumVotes}
      className={testClassName}
    />
  );
  const votingProgress = screen.getByTestId("voting-progress");
  expect(votingProgress.className).toMatch(testClassName);
  expect(votingProgress.children[0].className).toMatch("votingProgressYes");
  expect(votingProgress.children[0].style.width).toMatch("50%");
  expect(votingProgress.children[1].className).toMatch("votingProgressNo");
  expect(votingProgress.children[1].style.width).toMatch("75%");
});
