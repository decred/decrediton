const TooltipInfo = ({ live, maturing, vote, revoke, dayDate, month }) => <>
  <div>{`${vote ? vote : 0} Tickets Voted`}</div>
  <div>{`${live ? live : 0} Tickets Live`}</div>
  <div>{`${maturing ? maturing : 0} Tickets Maturing`}</div>
  <div>{`${revoke ? revoke : 0} Tickets Revoked`}</div>
  <div>
    <span>{` on ${dayDate.getDate()}. `}</span><span>{month}</span><span>{` ${dayDate.getFullYear()}`}</span>
  </div>
</>

export default TooltipInfo;
