import StakePoolsList from "components/views/TicketsPage/PurchaseTab/LEGACY_PurchasePage/LEGACY_StakePools/StakePoolsList";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const mockConfiguredStakePools = [
  {
    APIVersionsSupported: [1, 2],
    ApiKey: "test-api-key1",
    Host: "https://test-stakepool1.eu",
    Network: "testnet",
    PoolAddress: "test-address-1",
    PoolFees: 2,
    Script: "test-script-1",
    TicketAddress: "test-ticket-address-1",
    VoteBits: 5,
    VoteBitsVersion: 0,
    VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }],
    isVersionValid: true,
    label: "https://test-stakepool1.eu",
    value: {
      APIVersionsSupported: [1, 2],
      ApiKey: "test-api-key1",
      Host: "https://test-stakepool1.eu",
      Network: "testnet",
      PoolAddress: "test-address-1",
      PoolFees: 2,
      Script: "test-script-1",
      TicketAddress: "test-ticket-address-1",
      VoteBits: 5,
      VoteBitsVersion: 0,
      VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }]
    }
  },
  {
    APIVersionsSupported: [1, 2],
    ApiKey: "test-api-key2",
    Host: "https://test-stakepool2.eu",
    Network: "testnet",
    PoolAddress: "test-address2",
    PoolFees: 4,
    Script: "test-script-2",
    TicketAddress: "test-ticket-address-2",
    VoteBits: 5,
    VoteBitsVersion: 0,
    VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }],
    isVersionValid: true,
    label: "https://test-stakepool2.eu",
    value: {
      APIVersionsSupported: [1, 2],
      ApiKey: "test-api-key2",
      Host: "https://test-stakepool2.eu",
      Network: "testnet",
      PoolAddress: "test-address-2",
      PoolFees: 4,
      Script: "test-script-2",
      TicketAddress: "test-ticket-address-2",
      VoteBits: 5,
      VoteBitsVersion: 0,
      VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }]
    }
  }
];

let mockOnShowAddStakePool;
let mockOnRemoveStakePool;
let mockRescanRequest = null;
let mockToggleBackupModal;
let mockToggleShowVsp;
beforeEach(() => {
  mockOnShowAddStakePool = jest.fn(() => {});
  mockOnRemoveStakePool = jest.fn(() => {});
  mockRescanRequest = undefined;
  mockToggleBackupModal = jest.fn(() => {});
  mockToggleShowVsp = jest.fn(() => {});
});

test("test empty legacy stakepool list", () => {
  render(
    <StakePoolsList
      onShowAddStakePool={mockOnShowAddStakePool}
      onRemoveStakePool={mockOnRemoveStakePool}
      rescanRequest={mockRescanRequest}
      toggleBackupModal={mockToggleBackupModal}
      toggleShowVsp={mockToggleShowVsp}
      showModal={false}
    />
  );
  expect(screen.getByText(/you have no configured VSPs/i)).toBeInTheDocument();
});

test("test legacy stakepool list", () => {
  render(
    <StakePoolsList
      configuredStakePools={mockConfiguredStakePools}
      onShowAddStakePool={mockOnShowAddStakePool}
      onRemoveStakePool={mockOnRemoveStakePool}
      rescanRequest={mockRescanRequest}
      toggleBackupModal={mockToggleBackupModal}
      toggleShowVsp={mockToggleShowVsp}
      showModal={false}
    />
  );
  const deleteButtons = screen.getAllByRole("button", { name: "Remove VSP" });

  //
  // test first deleteButton
  //
  user.click(deleteButtons[0]);
  // cancel first
  const cancelButtons = screen.getAllByRole("button", { name: "Cancel" });
  user.click(cancelButtons[1]);
  // try again
  user.click(deleteButtons[0]);
  user.click(screen.getByText("Confirm"));
  expect(mockOnRemoveStakePool).toHaveBeenCalledWith(
    mockConfiguredStakePools[0].Host
  );

  // test Add VSP button
  user.click(screen.getByText("Add VSP"));
  expect(mockOnShowAddStakePool).toHaveBeenCalled();
});
