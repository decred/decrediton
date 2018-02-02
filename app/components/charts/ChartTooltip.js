import "style/Chart.less";

const ChartLegend = (props) => {
  const { payload } = props;
  console.log(payload)

  return (
    <div className="chart-tooltip">
      {
        payload.map((entry, index) => (
          <div key={`item-${index}`}>{entry.value}</div>
        ))
      }
    </div>
  );
};


export default ChartLegend;
