import { useState } from "react";
import ErrorScreen from "ErrorScreen";
import HistoryPage from "./HistoryPage/HistoryPage";
import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { Balance } from "shared";
import { DCR } from "constants";
import { useService } from "hooks";
import { useHistoryTab } from "./hooks";
import { selectedTxTypesFromFilter, getSortTypes, getTxTypes } from "./helpers";
import styles from "./HistoryTab.module.css";

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
                classNameWrapper={styles.smallBalance}
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
  const selTxTypeKeys = selectedTxTypesFromFilter(transactionsFilter);

  const [searchText, setSearchText] = useState(search);
  const [selectedTxTypeKeys, setSelectedTxTypeKeys] = useState(selTxTypeKeys);
  const [selectedSortOrderKey, setSelectedSortOrderKey] = useState(
    listDirection
  );

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
    if (value.type) {
      // if -1 it is all options, so we clean the filter.
      if (value.type === -1) {
        // TODO enable filtering more than one type each time.
        transactionsFilter.types = [];
      } else {
        // otherwise we push it to the array option.
        transactionsFilter.types.push(value.type);
      }
      delete value.type;
    }
    const newFilter = {
      ...transactionsFilter,
      ...value
    };
    onChangeTransactionsFilter(newFilter);
  };

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <HistoryPage
      {...{
        tsDate,
        loadMoreThreshold,
        transactions,
        transactionsFilter,
        noMoreTransactions,
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
        onChangeSliderValue
      }}
    />
  );
};

export default HistoryTab;
