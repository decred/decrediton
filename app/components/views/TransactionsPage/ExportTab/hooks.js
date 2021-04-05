import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as sta from "actions/StatisticsActions";
import { useIntl } from "react-intl";

export function useExportTab() {
  const exportingData = useSelector(sel.exportingData);
  const dispatch = useDispatch();
  const exportStatToCSV = (opts) => dispatch(sta.exportStatToCSV(opts));
  const intl = useIntl();

  return {
    exportingData,
    exportStatToCSV,
    intl
  };
}
