import { SHOW_SIDEBAR, HIDE_SIDEBAR, SHOW_SIDEBAR_MENU, HIDE_SIDEBAR_MENU } from "../actions/SidebarActions";

function getInitialState() {
  return {
    showingSidebar: true,
    showingSidebarMenu: true,
  };
}

export default function sidebar(state = getInitialState(), action) {
  switch (action.type) {
  case HIDE_SIDEBAR:
    return {
      ...state,
      showingSidebar: false,
    };
  case SHOW_SIDEBAR:
    return {
      ...state,
      showingSidebar: true,
    };
  case HIDE_SIDEBAR_MENU:
    return {
      ...state,
      showingSidebarMenu: false,
    };
  case SHOW_SIDEBAR_MENU:
    return {
      ...state,
      showingSidebarMenu: true,
    };
  default:
    return state;
  }
}
