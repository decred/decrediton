
import { Balance } from "shared/Balance";
import { shallow } from "enzyme";
import sinon from "sinon";

test("atoms display", () => {
  const spy = sinon.spy();

  const balance = shallow(
    <Balance currencyDisplay="atoms" amount={42} onClick={spy} />
  );

  expect(balance.childAt(0).text()).toEqual("42 atoms");

  balance.childAt(0).simulate("click");
  expect(spy.calledOnce).toEqual(true);
});

test("DCR display", () => {
  const spy = sinon.spy();

  const balance = shallow(
    <Balance currencyDisplay="DCR" amount={420000001} onClick={spy} />
  );

  expect(balance.childAt(0).childAt(0).childAt(0).prop("value")).toEqual("4.20");

  balance.childAt(0).simulate("click");

  expect(spy.calledOnce).toEqual(true);
});
