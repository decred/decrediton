// @flow

export const EXPAND_SIDE_MENU = "EXPAND_SIDE_MENU";
export const REDUCE_SIDE_MENU = "REDUCE_SIDE_MENU";
export const SIDEBAR_TO_BOTTOM = "SIDEBAR_TO_BOTTOM";
export const SIDEBAR_LEAVE_BOTTOM = "SIDEBAR_LEAVE_BOTTOM";

export const expandSideBar = () => (dispatch) => {
  dispatch({ type: EXPAND_SIDE_MENU });
};

export const reduceSideBar = () => (dispatch) => {
  dispatch({ type: REDUCE_SIDE_MENU });
};

export const sidebarToBottom = () => (dispatch) => {
  dispatch({ type: SIDEBAR_TO_BOTTOM });
};

export const onSidebarLeaveBottom = () => (dispatch) => {
  dispatch({ type: SIDEBAR_LEAVE_BOTTOM });
};
