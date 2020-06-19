import { useEffect, useState, useCallback } from "react";

export function useLastBlockTime(lastBlockTimestamp, clearTimeout, setTimeout) {
  const [lastBlockDate, setLastBlockDate] = useState(null);
  const [lastBlockIsRecent, setLastBlockIsRecent] = useState(null);
  const [updateRecentTimer, setUpdateRecentTimer] = useState(null);

  const getBlockDate = useCallback((lastBlockTimestamp) => {
    let _lastBlockDate;
    let _lastBlockIsRecent = false;
    let _updateRecentTimer = updateRecentTimer || null;

    if (lastBlockTimestamp) {
      if (_updateRecentTimer) {
        clearTimeout(_updateRecentTimer);
        _updateRecentTimer = null;
      }

      const now = new Date();
      _lastBlockDate = new Date(lastBlockTimestamp * 1000);
      const timeFromLastBlock = now.getTime() - _lastBlockDate.getTime();
      _lastBlockIsRecent = timeFromLastBlock < 60000;
      if (_lastBlockIsRecent) {
        _updateRecentTimer = setTimeout(
          () => {
            const {
              _lastBlockDate,
              _lastBlockIsRecent,
              _updateRecentTimer
            } = getBlockDate(lastBlockTimestamp);
            setLastBlockDate(_lastBlockDate);
            setLastBlockIsRecent(_lastBlockIsRecent);
            setUpdateRecentTimer(_updateRecentTimer);
          },
          60000 - timeFromLastBlock
        );
      }
    }
    return { _lastBlockDate, _lastBlockIsRecent, _updateRecentTimer };
  }, [updateRecentTimer, clearTimeout, setTimeout]);

  useEffect(() => {
    const {
      _lastBlockDate,
      _lastBlockIsRecent,
      _updateRecentTimer
    } = getBlockDate(lastBlockTimestamp);
    setLastBlockDate(_lastBlockDate);
    setLastBlockIsRecent(_lastBlockIsRecent);
    setUpdateRecentTimer(_updateRecentTimer);
  }, [lastBlockTimestamp, getBlockDate]);

  return { lastBlockDate, lastBlockIsRecent };
}
