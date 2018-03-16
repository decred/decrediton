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

export const EXPAND_SIDE_MENU = "EXPAND_SIDE_MENU";
export const REDUCE_SIDE_MENU = "REDUCE_SIDE_MENU";

export const expandSideBar = () => (dispatch) => {
  dispatch({ type: EXPAND_SIDE_MENU });
};

export const reduceSideBar = () => (dispatch) => {
  dispatch({ type: REDUCE_SIDE_MENU });
};
