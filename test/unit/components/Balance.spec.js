import React from 'react';
import { Balance } from '../../../app/components/Balance';
import { shallow } from 'enzyme';
import sinon from 'sinon';

test('atoms display', () => {
  const spy = sinon.spy();
  // Render a checkbox with label in the document
  const balance = shallow(
    <Balance currencyDisplay="atoms" amount={42} onClick={spy} />
  );

  expect(balance.find('.balance-base').text()).toEqual('42 atoms');

  balance.find('.balance-base').simulate('click');

  expect(spy.calledOnce).toEqual(true);
});
test('DCR display', () => {
  const spy = sinon.spy();
  // Render a checkbox with label in the document
  const balance = shallow(
    <Balance currencyDisplay="DCR" amount={420000001} onClick={spy} />
  );

  expect(balance.find('.balance-base').text()).toEqual('4.20000001 DCR');

  balance.find('.balance-base').simulate('click');

  expect(spy.calledOnce).toEqual(true);
});
