import { MeteredChart } from "charts";
import { myTicketsCharts } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { StakePoolSelect } from "inputs";
import { Tooltip } from "shared";
import { createCanvas } from "canvas"
import { drawContributions } from "./drawCanvas";
import jsonData from "./mock.json";
import ticketData from "./mockTicketData.json"

@autobind
class HeatmapStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
    }
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    this.setState({ canvas });
    // this.props.getTicketsHeatmapStats();
  }

  render() {
    const contributionData = jsonData;
    const { canvas } = this.state;
    return (
      <div>
        <canvas ref="canvas" width="200" height="200"></canvas>
        {canvas && drawContributions(canvas, {
          data: ticketData,
          username: "myusername",
          themeName: "standard",
          footerText: "Made by @sallar - github-contributions.now.sh"
        })}
      </div>)
  }
}

export default myTicketsCharts(HeatmapStats);
