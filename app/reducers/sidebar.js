import {
  EXPAND_SIDE_MENU,
  REDUCE_SIDE_MENU,
  SIDEBAR_TO_BOTTOM,
  SIDEBAR_LEAVE_BOTTOM
} from "../actions/SidebarActions";

export default function sidebar(state = {}, action) {
  switch (action.type) {
  case EXPAND_SIDE_MENU:
    return {
      ...state,
      expandSideBar: true
    };
  case REDUCE_SIDE_MENU:
    return {
      ...state,
      expandSideBar: false
    };
  case SIDEBAR_TO_BOTTOM:
    return {
      ...state,
      expandSideBar: false,
      sidebarOnBottom: true
    };
  case SIDEBAR_LEAVE_BOTTOM:
    return {
      ...state,
      sidebarOnBottom: false
    };
  default:
    return state;
  }
}
