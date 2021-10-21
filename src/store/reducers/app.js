import * as types from "../action-types";
const initState = {
  sidebarCollapsed: false,
  settingPanelVisible: false,
  appData: {}
};
export default function app(state = initState, action) {
  switch (action.type) {
    case types.APP_TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    case types.APP_TOGGLE_SETTINGPANEL:
      return {
        ...state,
        settingPanelVisible: !state.settingPanelVisible,
      };
    case types.APP_GLOBEL_DATA:
      return {
        ...state,
        appData: action.payload,
      };
    default:
      return state;
  }
}
