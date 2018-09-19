// @flow

export const EXPAND_SIDE_MENU = "EXPAND_SIDE_MENU";
export const REDUCE_SIDE_MENU = "REDUCE_SIDE_MENU";

export const expandSideBar = () => (dispatch) => {
  dispatch({ type: EXPAND_SIDE_MENU });
};

export const reduceSideBar = () => (dispatch) => {
  dispatch({ type: REDUCE_SIDE_MENU });
};
