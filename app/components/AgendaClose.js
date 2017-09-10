import React from "react";
import "../style/AgendaCard.less";

const AgendaClose = ({ onClick }) => (
  <a className="agenda-overview-title-close" onClick={onClick}></a>
);

export default AgendaClose;
