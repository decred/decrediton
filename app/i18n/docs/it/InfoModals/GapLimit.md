# Limite di intervallo

**Attenzione! Questa impostazione del limite di intervallo non dovrebbe in
genere essere cambiata.** Un aumento del limite di intervallo potrebbe causare
un notevole degrado delle prestazioni.

Il limite di intervallo imposta la quantità di indirizzi che il portafoglio
genererà e guarderà avanti per determinare l'utilizzo. Per impostazione
predefinita, il limite di intervallo è impostato a 20.  Questo significa 2
cose:

1. quando il portafoglio viene caricato per la prima volta, analizza l'utilizzo
   degli indirizzi e si aspetta che l'intervallo più ampio tra gli indirizzi
   sia 20;

2. quando fornisce all'utente nuovi indirizzi appena generati, fornisce solo 20
   indirizzi e poi ricomincia da capo, il che assicura che gli spazi tra gli
   indirizzi non siano più ampi di 20.

Ci sono in realtà solo 2 ragioni per cambiare questo valore:

1. Se il vostro portafoglio è stato creato e usato pesantemente prima
   della v1.0 più o meno, potrebbe avere grandi intervalli di indirizzo. Se si
   ripristina dal seed e si nota che mancano dei fondi, si può aumentare questo
   valore fino a 100 (poi 1000 se non viene risolto) e poi riavviare
   decrediton.  Una volta che il vostro saldo è stato risolto, potete
   reimpostare il limite a 20.

2. Se volete essere in grado di generare più di 20 indirizzi alla volta senza
   ricominciare da capo.
