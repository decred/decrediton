import {
  EXPAND_SIDE_MENU,
  REDUCE_SIDE_MENU,
  SIDEBAR_TO_BOTTOM,
} from "../actions/SidebarActions";

export default function sidebar(state = {}, action) {
  switch (action.type) {
  case EXPAND_SIDE_MENU:
    return {
      ...state,
      expandSideBar: true,
      sidebarOnBottom: false,
    };
  case REDUCE_SIDE_MENU:
    return {
      ...state,
      sidebarOnBottom: false,
      expandSideBar: false
    };
  case SIDEBAR_TO_BOTTOM:
    return {
      ...state,
      expandSideBar: false,
      sidebarOnBottom: true,
    }
  default:
    return state;
  }
}
