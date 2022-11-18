import * as sba from "actions/SidebarActions";
import { cloneDeep } from "fp";
import { createStore } from "test-utils.js";

const sidebarActions = sba;

const initialState = {
  sidebar: {
    expandSideBar: false,
    sidebarOnBottom: false
  }
};

test("test sidebarActions", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(sidebarActions.expandSideBar());

  expect(store.getState().sidebar.expandSideBar).toBeTruthy();
  expect(store.getState().sidebar.sidebarOnBottom).toBe(
    initialState.sidebar.sidebarOnBottom
  ); // didn't change

  // try to expand it again, store should not change
  await store.dispatch(sidebarActions.expandSideBar());
  expect(store.getState().sidebar.expandSideBar).toBeTruthy();
  expect(store.getState().sidebar.sidebarOnBottom).toBe(
    initialState.sidebar.sidebarOnBottom
  ); // didn't change
});

test("test reduceSideBar", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      sidebar: { ...initialState.sidebar, expandSideBar: true }
    })
  );
  await store.dispatch(sidebarActions.reduceSideBar());

  expect(store.getState().sidebar.expandSideBar).toBeFalsy();
  expect(store.getState().sidebar.sidebarOnBottom).toBe(
    initialState.sidebar.sidebarOnBottom
  ); // didn't change

  await store.dispatch(sidebarActions.reduceSideBar());
  expect(store.getState().sidebar.expandSideBar).toBeFalsy();
  expect(store.getState().sidebar.sidebarOnBottom).toBe(
    initialState.sidebar.sidebarOnBottom
  ); // didn't change
});

test("test sidebarToBottom", async () => {
  const store = createStore(cloneDeep(initialState));
  await store.dispatch(sidebarActions.sidebarToBottom());

  expect(store.getState().sidebar.sidebarOnBottom).toBeTruthy();
  expect(store.getState().sidebar.expandSideBar).toBe(
    initialState.sidebar.expandSideBar
  ); // didn't change

  // try to move sidebar to bottom it again, store should not change
  await store.dispatch(sidebarActions.sidebarToBottom());
  expect(store.getState().sidebar.sidebarOnBottom).toBeTruthy();
  expect(store.getState().sidebar.expandSideBar).toBe(
    initialState.sidebar.expandSideBar
  ); // didn't change
});

test("test onSidebarLeaveBottom", async () => {
  const store = createStore(
    cloneDeep({
      ...initialState,
      sidebar: { ...initialState.sidebar, sidebarOnBottom: true }
    })
  );
  await store.dispatch(sidebarActions.onSidebarLeaveBottom());

  expect(store.getState().sidebar.sidebarOnBottom).toBeFalsy();
  expect(store.getState().sidebar.expandSideBar).toBe(
    initialState.sidebar.expandSideBar
  ); // didn't change

  // try to move sidebar from bottom it again, store should not change
  await store.dispatch(sidebarActions.onSidebarLeaveBottom());
  expect(store.getState().sidebar.sidebarOnBottom).toBeFalsy();
  expect(store.getState().sidebar.expandSideBar).toBe(
    initialState.sidebar.expandSideBar
  ); // didn't change
});
