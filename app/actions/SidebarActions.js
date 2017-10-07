// @flow

export const SHOW_SIDEBAR_MENU = "SHOW_SIDEBAR_MENU";
export const HIDE_SIDEBAR_MENU = "HIDE_SIDEBAR_MENU";

export function showSidebarMenu() {
  return (dispatch) => {
    dispatch({ type: SHOW_SIDEBAR_MENU });
  };
}

export function hideSidebarMenu() {
  return (dispatch) => {
    dispatch({ type: HIDE_SIDEBAR_MENU });
  };
}

export const SHOW_SIDEBAR = "SHOW_SIDEBAR";
export const HIDE_SIDEBAR = "HIDE_SIDEBAR";

export function showSidebar() {
  return (dispatch) => {
    dispatch({ type: SHOW_SIDEBAR });
  };
}

export function hideSidebar() {
  return (dispatch) => {
    dispatch({ type: HIDE_SIDEBAR });
  };
}

