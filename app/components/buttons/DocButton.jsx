import { ButtonIcon, useTheme, getThemeProperty } from "pi-ui";
import { wallet } from "wallet-preload-shim";

const DocButton = ({ className, docUrl }) => {
  const { theme } = useTheme();
  const iconBackgroundColor = getThemeProperty(theme, "grey-6");

  return (
    <ButtonIcon
      className={className}
      iconBackgroundColor={iconBackgroundColor}
      onClick={() => wallet.openExternalURL(docUrl)}
      type="questionmark"
    />
  );
};
export default DocButton;
