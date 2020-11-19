# Informazioni sul backup del portafoglio LN 

A causa della sua natura di rete di secondo livello, i dati del portafoglio relativi al LN **non** sono immagazzinati nella blockchain stessa. Ciò significa che il seed del portafoglio standard
**non è sufficiente** per ripristinare l'equilibrio LN di un portafoglio in caso di re-seed.

Gli utenti LN devono **anche** conservare regolarmente e in modo sicuro il _SCB file _ in modo che
un lighting wallet ripristinato possa essere utilizzato per chiudere i canali aperti dal portafoglio precedente.

Il backup dovrebbe essere aggiornato ogni volta che un canale viene aperto o chiuso sul nodo LN locale (anche quando un nodo _remote_ apre un canale verso il nodo locale).

Per ulteriori informazioni sui backup LN, consultare la documentazione sull'URL
https://docs.decred.org/lightning-network/backups/
