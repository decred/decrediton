import { render as rtlRender } from "@testing-library/react";
import { createMemoryHistory } from "history";
import configureStore from "store/configureStore";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router-dom";
import locales, { defaultFormats } from "i18n/locales";
import { IntlProvider } from "react-intl";
import { PropTypes } from "prop-types";

beforeEach(() => {
  jest.spyOn(console, "groupCollapsed").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  console.groupCollapsed.mockRestore();
  console.info.mockRestore();
});

const render = (ui, { locale = locales[1], ...options }) => {
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

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};



export * from "@testing-library/react";
export { render };
