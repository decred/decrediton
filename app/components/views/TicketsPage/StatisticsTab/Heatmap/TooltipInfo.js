import { FormattedMessage as T } from "react-intl";

const Vote = ({ vote }) => <T
  id="heatmap.tooltip.vote"
  m={"{vote, plural, =0 {No tickets voted} one {One ticket voted} other {# tickets voted} }"}
  values={{ vote: vote || 0 }}
/>;

const Live = ({ live }) => <T
  id="heatmap.tooltip.live"
  m={"{live, plural, =0 {No tickets live} one {One ticket live} other {# tickets live} }"}
  values={{ live: live || 0 }}
/>;

const Revoked = ({ revoke }) =>
  <T
    id="heatmap.tooltip.revoked"
    m={"{revoke, plural, =0 {No tickets revoked} one {One ticket revoked} other {# tickets revoked} }"}
    values={{ revoke: revoke || 0 }}
  />;

const Maturing = ({ maturing }) =>
  <T
    id="heatmap.tooltip.maturing"
    m={"{maturing, plural, =0 {No tickets maturing} one {One ticket maturing} other {# tickets maturing} }"}
    values={{ maturing: maturing || 0 }}
  />;


const TooltipInfo = ({ live, maturing, vote, revoke, dayDate }) => <>
  <div>{ Vote({ vote }) }</div>
  <div>{ Live({ live }) }</div>
  <div>{ Maturing({ maturing }) }</div>
  <div>{ Revoked({ revoke }) }</div>
  <div>
    <T id="heatmap.tooltip.date"
      m="{dayDate, date, medium}"
      values={{ dayDate: dayDate }}/>
  </div>
</>;

export default TooltipInfo;
