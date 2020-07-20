import { render as rtlRender } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import configureStore from "store/configureStore";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router-dom";
import locales, { defaultFormats } from "i18n/locales";
import { IntlProvider } from "react-intl";
import { PropTypes } from "prop-types";

beforeAll(() => {
  jest.spyOn(console, "groupCollapsed").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
});

afterAll(() => {
  console.groupCollapsed.mockRestore();
  console.info.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
});

function render(ui, renderOptions) {
  const locale = locales[1];
  const Wrapper = ({ children }) => {
    const history = createMemoryHistory();
    const store = configureStore({}, history);

    const ContainerApp = () => {
      return (
        <IntlProvider
          locale={locale.language}
          messages={locale.messages}
          formats={locale.formats}
          defaultFormats={defaultFormats}
          key={locale.key}>
          {children}
        </IntlProvider>
      );
    };
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" component={ContainerApp} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  };

  Wrapper.propTypes = {
    children: PropTypes.node
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { render };
