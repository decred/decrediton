import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sta from "actions/StatisticsActions";

export function useExportTab() {
  const exportingData = useSelector(sel.exportingData);
  const dispatch = useDispatch();
  const exportStatToCSV = useCallback(
    (opts) => dispatch(sta.exportStatToCSV(opts)),
    [dispatch]
  );

  return {
    exportingData,
    exportStatToCSV
  };
}
