## Warning

Force-closing an offline channel is an _uncooperative_ close. This means your funds may be timelocked by the commitment transaction and by any outstanding (open) HTLCs until the sweeper component detects that the funds are redeemable.

