import Page from "./HeatmapWrapper";
import { DecredLoading } from "indicators";
import { useStatistics } from "../hooks.js";
import { useMountEffect } from "hooks";
import styles from "../Statistics.module.css";

const Heatmap = () => {
  const { ticketDataHeatmap, getTicketsHeatmapStats } = useStatistics();
  useMountEffect(() => {
    getTicketsHeatmapStats();
  });

  return ticketDataHeatmap.length > 0 ? (
    <Page {...{ data: ticketDataHeatmap }} />
  ) : (
    <DecredLoading className={styles.newLogoAnimation}/>
  );
};

export default Heatmap;
