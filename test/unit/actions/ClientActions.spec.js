import * as wal from "wallet";
import * as cla from "actions/ClientActions";
import { createStore } from "test-utils.js";
import { waitFor } from "@testing-library/react";
import {
  defaultMockAvailableMainnetVsps,
  defaultMockAvailableTestnetVsps,
  defaultMockAvailableInvalidVsps
} from "./vspMocks.js";
import { cloneDeep } from "fp";

const clientActions = cla;
const wallet = wal;

const testTreasuryPolicies = {
  policiesList: [{ key: "k1", policy: "p1" }]
};
const testTSpendPolicies = {
  policiesList: [{ hash: "h1", policy: "" }]
};
const testErrorMsg = "test-error-msg";
const mockAvailableMainnetVsps = cloneDeep(defaultMockAvailableMainnetVsps);
let mockGetVSPTicketStatus;

beforeEach(() => {
  wallet.getTreasuryPolicies = jest.fn(() =>
    Promise.resolve(testTreasuryPolicies)
  );
  wallet.setTreasuryPolicy = jest.fn(() => Promise.resolve());

  wallet.getTSpendPolicies = jest.fn(() => Promise.resolve(testTSpendPolicies));
  wallet.setTSpendPolicy = jest.fn(() => Promise.resolve());

  mockGetVSPTicketStatus = wallet.getAllVSPs = jest.fn(() => [
    ...mockAvailableMainnetVsps,
    ...cloneDeep(defaultMockAvailableTestnetVsps),
    ...cloneDeep(defaultMockAvailableInvalidVsps)
  ]);
});

test("test getTreasuryPolicies", async () => {
  const store = createStore({});

  await store.dispatch(clientActions.getTreasuryPolicies());
  await waitFor(() =>
    expect(store.getState().grpc.getTreasuryPoliciesRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(
    testTreasuryPolicies.policiesList
  );
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(null);
});

test("test getTreasuryPolicies (failed request)", async () => {
  wallet.getTreasuryPolicies = jest.fn(() => Promise.reject(testErrorMsg));
  const store = createStore({});

  await store.dispatch(clientActions.getTreasuryPolicies());
  await waitFor(() =>
    expect(store.getState().grpc.getTreasuryPoliciesRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(undefined);
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(testErrorMsg);
});

test("test setTreasuryPolicy", async () => {
  const store = createStore({});

  await store.dispatch(clientActions.setTreasuryPolicy());
  await waitFor(() =>
    expect(store.getState().grpc.setTreasuryPolicyRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.setTreasuryPolicyError).toBe(null);

  // treasury policies have been refreshed
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(
    testTreasuryPolicies.policiesList
  );
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(null);
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
});

test("test setTreasuryPolicy (failed request)", async () => {
  wallet.setTreasuryPolicy = jest.fn(() => Promise.reject(testErrorMsg));
  const store = createStore({});

  await store.dispatch(clientActions.setTreasuryPolicy());
  await waitFor(() =>
    expect(store.getState().grpc.setTreasuryPolicyRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.setTreasuryPolicyError).toBe(testErrorMsg);

  // treasury policies have NOT been refreshed
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(undefined);
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(undefined);
  expect(mockGetVSPTicketStatus).not.toHaveBeenCalled();
});

test("test getTSpendPolicies", async () => {
  const store = createStore({});

  await store.dispatch(clientActions.getTSpendPolicies());
  await waitFor(() =>
    expect(store.getState().grpc.getTSpendPoliciesRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.getTSpendPoliciesResponse).toBe(
    testTSpendPolicies.policiesList
  );
  expect(store.getState().grpc.getTSpendPoliciesError).toBe(null);
});

test("test getTSpendPolicies (failed request)", async () => {
  wallet.getTSpendPolicies = jest.fn(() => Promise.reject(testErrorMsg));
  const store = createStore({});

  await store.dispatch(clientActions.getTSpendPolicies());
  await waitFor(() =>
    expect(store.getState().grpc.getTSpendPoliciesRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.getTSpendPoliciesResponse).toBe(undefined);
  expect(store.getState().grpc.getTSpendPoliciesError).toBe(testErrorMsg);
});

test("test setTSpendPolicy", async () => {
  const store = createStore({});

  await store.dispatch(clientActions.setTSpendPolicy());
  await waitFor(() =>
    expect(store.getState().grpc.setTSpendPolicyRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.setTSpendPolicyError).toBe(null);

  // tspend policies have been refreshed
  expect(store.getState().grpc.getTSpendPoliciesResponse).toBe(
    testTSpendPolicies.policiesList
  );
  expect(store.getState().grpc.getTSpendPoliciesError).toBe(null);
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
});

test("test setTSpendPolicy (failed request)", async () => {
  wallet.setTSpendPolicy = jest.fn(() => Promise.reject(testErrorMsg));
  const store = createStore({});

  await store.dispatch(clientActions.setTSpendPolicy());
  await waitFor(() =>
    expect(store.getState().grpc.setTSpendPolicyRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.setTSpendPolicyError).toBe(testErrorMsg);
  expect(store.getState().grpc.setTSpendPolicyError).toBe(testErrorMsg);

  // tspend policies have NOT been refreshed
  expect(store.getState().grpc.getTSpendPoliciesResponse).toBe(undefined);
  expect(store.getState().grpc.getTSpendPoliciesError).toBe(undefined);
  expect(mockGetVSPTicketStatus).not.toHaveBeenCalled();
});
