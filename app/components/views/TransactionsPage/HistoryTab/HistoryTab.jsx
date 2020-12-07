import { useState } from "react";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./HistoryPage/HistoryPage";
import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { Balance } from "shared";
import { DCR } from "constants";
import { useService } from "hooks";
import { useHistoryTab } from "./hooks";
import { selectedTxTypeFromFilter, getSortTypes, getTxTypes } from "./helpers";

export const HistoryTabHeader = () => {
  const { totalBalance } = useHistoryTab();
  return (
    <DescriptionHeader
      description={
        <T
          id="transactions.description.history"
          m="Total Balance: {totalBalance}"
          values={{
            totalBalance: (
              <Balance
                flat
                amount={totalBalance}
                classNameWrapper="header-small-balance"
              />
            )
          }}
        />
      }
    />
  );
};

const HistoryTab = () => {
  const { walletService } = useService();
  const {
    window,
    tsDate,
    currencyDisplay,
    unitDivisor,
    transactions,
    transactionsFilter,
    noMoreTransactions,
    onGetTransactions,
    onChangeTransactionsFilter
  } = useHistoryTab();

  const { search, listDirection } = transactionsFilter;
  const selTxTypeKey = selectedTxTypeFromFilter(transactionsFilter);

  const [searchText, setSearchText] = useState(search);
  const [selectedTxTypeKey, setSelectedTxTypeKey] = useState(selTxTypeKey);
  const [selectedSortOrderKey, setSelectedSortOrderKey] = useState(listDirection);
  const [isChangingFilterTimer, setIsChangingFilterTimer] = useState(null);

  const loadMoreThreshold = 250 + Math.max(0, window.innerHeight - 765);

  const onChangeSelectedType = (type) => {
    onChangeFilter(type.value);
    setSelectedTxTypeKey(type.key);
  };

  const onChangeSortType = (type) => {
    onChangeFilter({ listDirection: type.value });
    setSelectedSortOrderKey(type.value);
  };

  const onChangeSearchText = (searchText) => {
    onChangeFilter({ search: searchText });
    setSearchText(searchText);
  };

  const onLoadMoreTransactions = () => onGetTransactions(false);

  const onChangeSliderValue = (value, minOrMax) => {
    // convert from atoms
    const amount = currencyDisplay === DCR ? value * unitDivisor : value;
    if (minOrMax === "min") {
      onChangeFilter({ minAmount: amount });
    } else if (minOrMax === "max") {
      onChangeFilter({ maxAmount: amount });
    }
  };

  const onChangeFilter = (value) => {
    if (isChangingFilterTimer) {
      clearTimeout(isChangingFilterTimer);
    }
    const changeFilter = (newFilterOpt) => {
      if (newFilterOpt.type) {
        // if -1 it is all options, so we clean the filter.
        if (newFilterOpt.type === -1) {
          // TODO enable filtering more than one type each time.
          transactionsFilter.types = [];
        } else {
          // otherwise we push it to the array option.
          transactionsFilter.types.push(newFilterOpt.type);
        }
        delete(newFilterOpt.type);
      }
      const newFilter = {
        ...transactionsFilter,
        ...newFilterOpt
      };
      clearTimeout(isChangingFilterTimer);
      onChangeTransactionsFilter(newFilter);
    };
    setIsChangingFilterTimer(setTimeout(() => changeFilter(value), 100));
  };

  return !walletService ? <ErrorScreen /> : (
    <HistoryPage
      {...{
        tsDate,
        loadMoreThreshold,
        transactions,
        transactionsFilter,
        noMoreTransactions,
        selectedSortOrderKey,
        selectedTxTypeKey,
        searchText,
        currencyDisplay,
        unitDivisor,
        txTypes: getTxTypes(),
        sortTypes: getSortTypes(),
        onChangeSelectedType,
        onChangeSortType,
        onChangeSearchText,
        onLoadMoreTransactions,
        onChangeSliderValue
      }}
    />
  );
};

export default HistoryTab;
