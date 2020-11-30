import { render as rtlRender } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import configureStore from "store/configureStore";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router-dom";
import { en as enLocale, defaultFormats } from "i18n/locales";
import locales from "i18n/locales";
import { IntlProvider } from "react-intl";
import { PropTypes } from "prop-types";
import { lightTheme, darkTheme, icons } from "style/themes";
import {
  defaultLightTheme,
  ThemeProvider,
  defaultDarkTheme,
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";

beforeAll(() => {
  jest.spyOn(console, "groupCollapsed").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.groupCollapsed.mockRestore();
  console.info.mockRestore();
  console.warn.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
});
const locale = enLocale;
const fonts = [];
const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme, ...lightTheme, ...icons },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme, ...darkTheme, ...icons }
};

function render(ui, renderOptions) {
  const history = createMemoryHistory();
  const currentSettings = {
    locale: locale.key,
    theme: DEFAULT_LIGHT_THEME_NAME,
    allowedExternalRequests: []
  };
  const Wrapper = ({ children }) => {
    let initialState = {
      settings: {
        currentSettings,
        tempSettings: currentSettings
      },
      locales: locales
    };
    if (
      renderOptions &&
      Object.prototype.hasOwnProperty.call(renderOptions, "initialState")
    ) {
      initialState = { ...initialState, ...renderOptions.initialState };
    }
    const store = configureStore(initialState, history);
    const ContainerApp = () => {
      return (
        <IntlProvider
          locale={locale.language}
          messages={locale.messages}
          formats={locale.formats}
          defaultFormats={defaultFormats}
          key={locale.key}>
          {children}
          <div id="modal-portal" />
        </IntlProvider>
      );
    };
    return (
      <ThemeProvider
        themes={themes}
        defaultThemeName={initialState.settings.currentSettings.theme}
        fonts={fonts}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" component={ContainerApp} />
            </Switch>
          </ConnectedRouter>
        </Provider>
      </ThemeProvider>
    );
  };

  Wrapper.propTypes = {
    children: PropTypes.node
  };

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    history
  };
}

export * from "@testing-library/react";
export { render };
