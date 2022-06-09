import { useState, useEffect, useMemo, useRef } from "react";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./HistoryPage";
import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { BalanceDisplay } from "shared";
import { DCR, BATCH_TX_COUNT } from "constants";
import { useService } from "hooks";
import { useHistoryTab } from "./hooks";
import { selectedTxTypesFromFilter, getSortTypes, getTxTypes } from "./helpers";

export const HistoryTabHeader = () => {
  const { totalBalance } = useHistoryTab();
  return (
    <DescriptionHeader
      description={
        <T
          id="transactions.description.history"
          m="Total Balance: {totalBalance}"
          values={{
            totalBalance: <BalanceDisplay amount={totalBalance} />
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
    onChangeTransactionsFilter,
    transactionsRequestAttempt
  } = useHistoryTab();

  const [index, setIndex] = useState(() =>
    Math.min(BATCH_TX_COUNT, transactions.length)
  );
  const [noMoreTransactionsToShow, setNoMoreTransactionsToShow] = useState(
    false
  );
  const { search, listDirection } = transactionsFilter;

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      setIndex(BATCH_TX_COUNT);
      setNoMoreTransactionsToShow(false);
    } else {
      isMounted.current = true;
    }
  }, [transactionsFilter, isMounted]);

  const selTxTypeKeys = selectedTxTypesFromFilter(transactionsFilter);

  const [searchText, setSearchText] = useState(search);
  const [selectedTxTypeKeys, setSelectedTxTypeKeys] = useState(selTxTypeKeys);
  const [selectedSortOrderKey, setSelectedSortOrderKey] = useState(
    listDirection
  );
  const [isChangingFilterTimer, setIsChangingFilterTimer] = useState(null);

  const loadMoreThreshold = 250 + Math.max(0, window.innerHeight - 765);

  const onChangeSelectedType = (type) => {
    onChangeFilter(type.value).then((newFilter) => {
      setSelectedTxTypeKeys(selectedTxTypesFromFilter(newFilter));
    });
  };

  const onChangeSortType = (type) => {
    onChangeFilter({ listDirection: type.value });
    setSelectedSortOrderKey(type.value);
  };

  const onChangeSearchText = (searchText) => {
    onChangeFilter({ search: searchText });
    setSearchText(searchText);
  };

  const onLoadMoreTransactions = () => {
    if (index < transactions.length) {
      setIndex(Math.min(index + BATCH_TX_COUNT, transactions.length));
    } else if (!noMoreTransactions) {
      onGetTransactions(false);
    } else {
      setNoMoreTransactionsToShow(true);
    }
  };

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
    return new Promise((resolve) => {
      if (isChangingFilterTimer) {
        clearTimeout(isChangingFilterTimer);
      }
      const changeFilter = (newFilterOpt) => {
        const { type, direction } = newFilterOpt;
        delete newFilterOpt.type;
        delete newFilterOpt.direction;
        const newFilter = { ...transactionsFilter, ...newFilterOpt };
        // if type is -1 it is all options, so we clean the filter.
        if (type === -1) {
          newFilter.types = [];
          newFilter.directions = [];
        } else if (direction) {
          // if the direction was already set, we remove it from
          // the directions array. otherwise, we push into it.
          if (newFilter.directions.includes(direction)) {
            newFilter.directions.splice(
              newFilter.directions.indexOf(direction),
              1
            );
          } else {
            newFilter.directions.push(direction);
          }
        } else if (type) {
          // if the type was already set, we remove it from
          // the typess array. otherwise, we push into it.
          if (newFilter.types.includes(type)) {
            newFilter.types.splice(newFilter.types.indexOf(type), 1);
          } else {
            newFilter.types.push(type);
          }
        }
        clearTimeout(isChangingFilterTimer);
        onChangeTransactionsFilter(newFilter);
        return newFilter;
      };
      setIsChangingFilterTimer(
        setTimeout(() => resolve(changeFilter(value)), 100)
      );
    });
  };

  const visibleTransactions = useMemo(() => transactions.slice(0, index), [
    index,
    transactions
  ]);

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <HistoryPage
      {...{
        tsDate,
        loadMoreThreshold,
        transactions: visibleTransactions,
        transactionsFilter,
        noMoreTransactions: noMoreTransactionsToShow,
        selectedSortOrderKey,
        selectedTxTypeKeys,
        searchText,
        currencyDisplay,
        unitDivisor,
        txTypes: getTxTypes(),
        sortTypes: getSortTypes(),
        onChangeSelectedType,
        onChangeSortType,
        onChangeSearchText,
        onLoadMoreTransactions,
        onChangeSliderValue,
        transactionsRequestAttempt
      }}
    />
  );
};

export default HistoryTab;
