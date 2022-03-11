import * as wal from "wallet";
import * as cla from "actions/ClientActions";
import { createStore } from "test-utils.js";
import { wait } from "@testing-library/react";

const clientActions = cla;
const wallet = wal;

const testTreasuryPolicies = {
  policiesList: [{ key: "k1", policy: "p1" }]
};
const testErrorMsg = "test-error-msg";

beforeEach(() => {
  wallet.getTreasuryPolicies = jest.fn(() =>
    Promise.resolve(testTreasuryPolicies)
  );
  wallet.setTreasuryPolicy = jest.fn(() => Promise.resolve());
});

test("test getTreasuryPolicies", async () => {
  const store = createStore({});

  await store.dispatch(clientActions.getTreasuryPolicies());
  await wait(() =>
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
  await wait(() =>
    expect(store.getState().grpc.getTreasuryPoliciesRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(undefined);
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(testErrorMsg);
});

test("test setTreasuryPolicy", async () => {
  const store = createStore({});

  await store.dispatch(clientActions.setTreasuryPolicy());
  await wait(() =>
    expect(store.getState().grpc.setTreasuryPolicyRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.setTreasuryPolicyError).toBe(null);

  // treasury policies have been refreshed
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(
    testTreasuryPolicies.policiesList
  );
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(null);
});

test("test setTreasuryPolicy (failed request)", async () => {
  wallet.setTreasuryPolicy = jest.fn(() => Promise.reject(testErrorMsg));
  const store = createStore({});

  await store.dispatch(clientActions.setTreasuryPolicy());
  await wait(() =>
    expect(store.getState().grpc.setTreasuryPolicyRequestAttempt).toBeFalsy()
  );
  expect(store.getState().grpc.setTreasuryPolicyError).toBe(testErrorMsg);

  // treasury policies have NOT been refreshed
  expect(store.getState().grpc.getTreasuryPoliciesResponse).toBe(undefined);
  expect(store.getState().grpc.getTreasuryPoliciesError).toBe(undefined);
});
