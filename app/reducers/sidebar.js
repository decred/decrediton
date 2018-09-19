import {
  EXPAND_SIDE_MENU,
  REDUCE_SIDE_MENU
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
  default:
    return state;
  }
}
