import SideBar from "components/SideBar/SideBar";
import { render } from "test-utils.js";

test("render Sidebar", () => {
    const { debug } = render(<SideBar/>);
    debug();
});
