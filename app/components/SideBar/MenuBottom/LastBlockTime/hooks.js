import { useEffect, useState, useCallback, useRef } from "react";

export function useLastBlockTime(lastBlockTimestamp, clearTimeout, setTimeout) {
  const [lastBlockDate, setLastBlockDate] = useState(null);
  const [lastBlockIsRecent, setLastBlockIsRecent] = useState(null);

  const updateRecentTimer = useRef(null);

  const getBlockDate = useCallback(
    (lastBlockTimestamp) => {
      let _lastBlockDate;
      let _lastBlockIsRecent = false;

      if (lastBlockTimestamp) {
        if (updateRecentTimer.current) {
          clearTimeout(updateRecentTimer.current);
          updateRecentTimer.current = null;
        }

        const now = new Date();
        _lastBlockDate = new Date(lastBlockTimestamp * 1000);
        const timeFromLastBlock = now.getTime() - _lastBlockDate.getTime();
        _lastBlockIsRecent = timeFromLastBlock < 60000;
        if (_lastBlockIsRecent) {
          updateRecentTimer.current = setTimeout(() => {
            const { _lastBlockDate, _lastBlockIsRecent } =
              getBlockDate(lastBlockTimestamp);
            setLastBlockDate(_lastBlockDate);
            setLastBlockIsRecent(_lastBlockIsRecent);
          }, 60000 - timeFromLastBlock);
        }
      }
      return { _lastBlockDate, _lastBlockIsRecent };
    },
    [updateRecentTimer, clearTimeout, setTimeout]
  );

  useEffect(() => {
    const { _lastBlockDate, _lastBlockIsRecent } =
      getBlockDate(lastBlockTimestamp);
    setLastBlockDate(_lastBlockDate);
    setLastBlockIsRecent(_lastBlockIsRecent);
  }, [lastBlockTimestamp, getBlockDate]);

  return { lastBlockDate, lastBlockIsRecent };
}
