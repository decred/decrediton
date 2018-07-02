# Gap Limit

**Warning! This gap limit setting should typically be left alone.**  An increase to the gap limit could cause major performance degradation.

Gap limit sets the amount of addresses that the wallet will generate and look ahead to determine usage.  By default, the gap limit is set to 20.  This means 2 things.

  1. When wallet first loads, it scans for address usage and expects the largest gap between addresses to be 20;

  2. When providing user with newly generated addresses it will only give 20 addresses then loop back, which ensures that gaps are no larger than 20.

There are really only 2 reasons that you should be changing this value:

  1. If your wallet was created and used heavily prior to roughly v1.0, it may have large address gaps.  If you restore from seed and notice that you are missing funds, you may increase this to 100 (then 1000 if not fixed) then restart decrediton.  Once your balance is resolved you can revert back to 20.

  2. If you would like to be able to generate more than 20 addresses at a time without wrapping around.
