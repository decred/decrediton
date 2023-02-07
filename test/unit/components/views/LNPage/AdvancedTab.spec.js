import { AdvancedTab } from "components/views/LNPage/AdvancedTab";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import { DCR } from "constants";
import * as sel from "selectors";
import * as lna from "actions/LNActions";
import * as wl from "wallet";
import {
  mockChannels,
  mockPendingChannels,
  mockClosedChannels,
  mockNetworkInfo
} from "./mocks";

const selectors = sel;
const lnActions = lna;
const wallet = wl;

const mockLnInfo = {
  identityPubkey: "mock-identityPubkey",
  alias: "mock-alias"
};

const mockLnTowersList = [
  {
    activeSessionCandidate: true,
    pubkey: "mock-tower-pubKey-0",
    pubkeyHex: "mock-tower-pubkeyHex-0",
    numSessions: 12,
    addressesList: ["mock-address-0-0", "mock-address-0-1"]
  },
  {
    activeSessionCandidate: false,
    pubkey: "mock-tower-pubKey-1",
    pubkeyHex: "mock-tower-pubkeyHex-1",
    numSessions: 6,
    addressesList: ["mock-address-1-0", "mock-address-1-1"]
  }
];

const mockNodeInfo = {
  node: {
    lastUpdate: 1631142997,
    pubKey:
      "012121212121111111110101021001201201020120102102012010210201201201",
    alias: "mock-node-alias"
  },
  numChannels: 26,
  totalCapacity: 10784848880,
  channelsList: [
    {
      channelId: "mock-channel-id-0",
      chanPoint: "mock-chanPoint-0",
      lastUpdate: 1631217741,
      node1Pub: "mock-node-1-pub-0",
      node2Pub: "mock-node-1-pub-1",
      capacity: 1000000000,
      node1Policy: {
        timeLockDelta: 80,
        minHtlc: 1000,
        feeBaseMAtoms: 1000,
        feeRateMilliMAtoms: 1,
        disabled: false,
        maxHtlcMAtoms: 990000000000,
        lastUpdate: 1631027797
      },
      node2Policy: {
        timeLockDelta: 80,
        minHtlc: 1000,
        feeBaseMAtoms: 1000,
        feeRateMilliMAtoms: 1,
        disabled: false,
        maxHtlcMAtoms: 990000000000,
        lastUpdate: 1631217741
      }
    },
    {
      channelId: "mock-channel-id-1",
      chanPoint: "mock-chanPoint-1",
      lastUpdate: 1631027797,
      node1Pub: "mock-node-2-pub-0",
      node2Pub: "mock-node-2-pub-1",
      capacity: 100000000,
      node1Policy: {
        timeLockDelta: 80,
        minHtlc: 1000,
        feeBaseMAtoms: 1000,
        feeRateMilliMAtoms: 1,
        disabled: true,
        maxHtlcMAtoms: 99000000000,
        lastUpdate: 1631027797
      },
      node2Policy: {
        timeLockDelta: 80,
        minHtlc: 1000,
        feeBaseMAtoms: 1000,
        feeRateMilliMAtoms: 1,
        disabled: false,
        maxHtlcMAtoms: 99000000000,
        lastUpdate: 1584830546
      }
    }
  ]
};
const mockLnSCBPath = "mock-backup-path";
const mockLnSCBUpdatedTime = new Date(163169514100);

let mockListWatchtowers;
let mockExportBackup;
let mockVerifyBackup;
let mockRemoveWatchtower;
let mockAddWatchtower;
let mockGetNodeInfo;

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  selectors.lnNetwork = jest.fn(() => mockNetworkInfo);
  selectors.lnInfo = jest.fn(() => mockLnInfo);
  selectors.lnTowersList = jest.fn(() => mockLnTowersList);
  selectors.lnNodeInfo = jest.fn(() => null);

  selectors.lnSCBPath = jest.fn(() => mockLnSCBPath);
  selectors.lnSCBUpdatedTime = jest.fn(() => mockLnSCBUpdatedTime);

  lnActions.getNetworkInfo = jest.fn(() => () => {});
  mockListWatchtowers = lnActions.listWatchtowers = jest.fn(() => () => {});
  mockExportBackup = lnActions.exportBackup = jest.fn(() => () => {});
  mockVerifyBackup = lnActions.verifyBackup = jest.fn(() => () => {});
  mockRemoveWatchtower = lnActions.removeWatchtower = jest.fn(() => () => {});
  mockAddWatchtower = lnActions.addWatchtower = jest.fn(
    () => () => Promise.resolve()
  );
  mockGetNodeInfo = lnActions.getNodeInfo = jest.fn(() => () => {});
});

test("test infos", () => {
  render(<AdvancedTab />);
  expect(mockListWatchtowers).toHaveBeenCalled();

  expect(screen.getByText("Node Alias").firstElementChild.textContent).toBe(
    mockLnInfo.alias
  );
});

test("test backup", async () => {
  expect(process.env.TZ).toBe("UTC");
  const { user } = render(<AdvancedTab />);
  expect(screen.getByText(mockLnInfo.identityPubkey)).toBeInTheDocument();
  expect(
    screen.getByText(`SCB backup file location: ${mockLnSCBPath}`)
  ).toBeInTheDocument();
  expect(
    screen.getByText("Last Updated: 3/4/1975 12:51 PM")
  ).toBeInTheDocument();

  const mockFilePath = "mockFilePath";
  wallet.showSaveDialog.mockReturnValueOnce({ filePath: mockFilePath });
  await user.click(screen.getByText("Backup Now"));
  await waitFor(() =>
    expect(mockExportBackup).toHaveBeenCalledWith(mockFilePath)
  );

  wallet.showOpenDialog.mockReturnValueOnce({
    filePaths: [mockFilePath],
    filePath: mockFilePath
  });
  await user.click(screen.getByText("Verify Backup"));
  await waitFor(() =>
    expect(mockVerifyBackup).toHaveBeenCalledWith(mockFilePath)
  );
});

test("test towers", async () => {
  const { user } = render(<AdvancedTab />);

  // check first tower
  expect(
    screen.getByText(mockLnTowersList[0].pubkeyHex).parentElement.parentElement
      .textContent
  ).toMatchInlineSnapshot(
    '"Remove tower×Sessions: 12mock-tower-pubkeyHex-0Copy to clipboardmock-address-0-0mock-address-0-1"'
  );

  // check second tower
  expect(
    screen.getByText(mockLnTowersList[1].pubkeyHex).parentElement.parentElement
      .textContent
  ).toMatchInlineSnapshot(
    '"Remove tower×Sessions: 6mock-tower-pubkeyHex-1Copy to clipboardmock-address-1-0mock-address-1-1"'
  );

  // check remove tower button
  await user.click(screen.getAllByText("Remove tower")[0].nextElementSibling);
  expect(mockRemoveWatchtower).toHaveBeenCalledWith(
    mockLnTowersList[0].pubkeyHex
  );

  // check add tower
  const mockTowerId = "mock-tower-id";
  const mockTowerAddress = "mock-tower-address";
  await user.type(screen.getByLabelText("Tower ID:"), mockTowerId);
  await user.type(screen.getByLabelText("Address:"), mockTowerAddress);
  await user.click(screen.getByText("Add"));
  expect(mockAddWatchtower).toHaveBeenCalledWith(mockTowerId, mockTowerAddress);
});

test("test query node", async () => {
  selectors.lnNodeInfo = jest.fn(() => mockNodeInfo);
  const { user } = render(<AdvancedTab />);

  await user.type(screen.getByLabelText("Node ID"), mockNodeInfo.node.pubKey);
  expect(mockGetNodeInfo).toHaveBeenCalledWith(mockNodeInfo.node.pubKey);
  expect(
    screen.getByText(mockNodeInfo.node.alias).parentElement.textContent
  ).toMatchInlineSnapshot(
    '"PubKey012121212121111111110101021001201201020120102102012010210201201201Aliasmock-node-aliasTotal Capacity107.8484888 DCRLast UpdateSep 8, 2021 11:16:37 PM"'
  );

  // first channel
  expect(
    screen.getByText(mockNodeInfo.channelsList[0].chanPoint).parentElement
      .parentElement.parentElement.parentElement.textContent
  ).toMatchInlineSnapshot(
    '"Capacity10.00000 DCRChannel Pointmock-chanPoint-0Last UpdateSep 9, 2021 8:02:21 PMCounterpartymock-node-1-pub-1Copy to clipboardPolicyNodeCounterpartyChan DisabledfalsefalseTimelock Delta8080Min HTLC0.00001 DCR0.00001 DCRMax HTLC9.90000 DCR9.90000 DCRLast UpdateSep 7, 2021 3:16:37 PMSep 9, 2021 8:02:21 PM"'
  );

  // second channel
  expect(
    screen.getByText(mockNodeInfo.channelsList[1].chanPoint).parentElement
      .parentElement.parentElement.parentElement.textContent
  ).toMatchInlineSnapshot(
    '"Capacity1.00000 DCRChannel Pointmock-chanPoint-1Last UpdateSep 7, 2021 3:16:37 PMCounterpartymock-node-2-pub-1Copy to clipboardPolicyNodeCounterpartyChan DisabledtruefalseTimelock Delta8080Min HTLC0.00001 DCR0.00001 DCRMax HTLC0.99000 DCR0.99000 DCRLast UpdateSep 7, 2021 3:16:37 PMMar 21, 2020 10:42:26 PM"'
  );
});
