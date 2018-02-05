import "style/Chart.less";

const ChartLegend = (props) => {
  const { payload } = props;
  const rowLegend = payload[0] && payload[0].payload.legendName;

  return (
    <div className="chart-tooltip">
      <div className="row-legend">{rowLegend}</div>
      {
        payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-line">
            <div className="circle-tooltip" style={{background:entry.fill}}></div>
            <div>{`${entry.dataKey}: ${entry.value} ${entry.unit}`}</div>
          </div>
        ))
      }
    </div>
  );
};


export default ChartLegend;
