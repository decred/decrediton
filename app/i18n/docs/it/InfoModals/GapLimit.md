# Limite del Divario

**Attenzione! Questa impostazione del limite di divario dovrebbe in genere essere lasciata intoccata.** Un aumento del limite di divario potrebbe causare un notevole degrado delle prestazioni.

Il limite di divario imposta la quantità di indirizzi che il portafoglio genererà e prevede anche di determinare l'utilizzo. Per impostazione predefinita, il limite di divario è impostato a 20.  Questo significa 2 cose.

  1. Quando il portafoglio viene caricato per la prima volta, analizza l'utilizzo dell'indirizzo e si aspetta che il divario più ampio tra gli indirizzi sia 20;

  2. Quando fornisce all'utente nuovi indirizzi appena generati, fornisce solo 20 indirizzi e poi fa un loop back, il che assicura che gli spazi tra gli indirizzi non siano più ampi di 20.

Ci sono in realtà solo 2 ragioni per cambiare questo valore:

  1. Se il vostro portafoglio è stato creato e usato pesantemente circa prima della v1.0 , potrebbe avere grandi spazi vuoti di indirizzo. Se si ripristina dal seed e si nota che mancano dei fondi, si può aumentare questo valore fino a 100 (poi 1000 se non viene risolto) e poi riavviare decrediton.  Una volta che il vostro saldo è stato risolto, potete reimpostare il limite a 20.

  2. 2. Se volete essere in grado di generare più di 20 indirizzi alla volta senza dovervi preoccupare.