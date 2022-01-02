import { useDispatch } from "react-redux";
import * as cla from "actions/ClientActions";
import { useTheme, getThemeProperty } from "pi-ui";

export function useLinkToAccounts() {
  const dispatch = useDispatch();

  const { theme } = useTheme();
  const iconColor = getThemeProperty(theme, "color-white");
  const goToAccounts = () => dispatch(cla.goToAccounts());

  return {
    goToAccounts,
    iconColor
  };
}
