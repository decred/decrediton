import GetStartedPage from "components/views/GetStartedPage";
import SideBar from "components/SideBar";

export default () =>
  <div className="page-body">
    {/* TODO: on the new layout, the sidebar is not used during the getstarted stage */}
    {/* This could have a switch to select the several getstarted pages  */}
    <SideBar/>
    <GetStartedPage />
  </div>;
