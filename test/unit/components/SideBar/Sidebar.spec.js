import { render } from "@testing-library/react";
import SideBar from "components/SideBar/SideBar";
import { createMemoryHistory } from "history";
import configureStore from "store/configureStore";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router-dom";
import locales, { defaultFormats } from "i18n/locales";
import { IntlProvider } from "react-intl";

beforeEach(() => {
  jest.spyOn(console, "groupCollapsed").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  console.groupCollapsed.mockRestore();
  console.info.mockRestore();
});

test("render Sidebar", () => {
    const history = createMemoryHistory();
    const store = configureStore({}, history);

    const ContainerApp = () => {
      const locale = locales[1];
      return <IntlProvider
        locale={locale.language}
        messages={locale.messages}
        formats={locale.formats}
        defaultFormats={defaultFormats}
        key={locale.key}>
          <SideBar/>
      </IntlProvider>;
    };

    const { debug } = render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" component={ContainerApp} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    debug();
});
