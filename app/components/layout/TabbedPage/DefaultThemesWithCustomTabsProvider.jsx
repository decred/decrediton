import { useTheme, getThemeProperty, ThemeProvider } from "pi-ui";

const DefaultThemesWithCustomTabsProvider = ({ themes, children }) => {
  const { theme } = useTheme();
  const themeName = "tabbedPageCustomThemeName";

  // this overwrite the themes with the default tabbedPage colors
  // and the with additional custom themes (e.g. Proposals TabbedPage)
  const customThemes = {
    [themeName]: {
      ...theme,
      "tab-default-background": getThemeProperty(
        theme,
        "tab-default-background-tabbedpage"
      ),
      "tab-default-color": getThemeProperty(
        theme,
        "tab-default-border-tabbedpage"
      ),
      ...themes
    }
  };

  return (
    <ThemeProvider themes={customThemes} defaultThemeName={themeName}>
      {children}
    </ThemeProvider>
  );
};

DefaultThemesWithCustomTabsProvider.propTypes = {
  themes: PropTypes.object,
  children: PropTypes.object.isRequired
};

DefaultThemesWithCustomTabsProvider.defaultProps = {
  themes: {}
};

export default DefaultThemesWithCustomTabsProvider;
