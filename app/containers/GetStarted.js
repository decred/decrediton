import { Route, Switch } from "react-router-dom";
import GetStartedPage from "components/views/GetStartedPage";
import SideBar from "components/SideBar";

export default () =>
  <div className="page-body">
    {/* TODO: on the new layout, the sidebar is not used during the getstarted stage */}
    <SideBar/>
    <Switch>
      <Route path="/getstarted" component={GetStartedPage} />
    </Switch>
  </div>;
