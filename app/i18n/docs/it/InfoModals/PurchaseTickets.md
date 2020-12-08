# Informazioni sull'acquisto di biglietti

**Conto** Il conto che acquisterà i biglietti e riceverà la ricompensa.

**Numero di biglietti** Il numero di biglietti si cui tentare l'acquisto.

**Tariffa del biglietto (DCR/kB)** I biglietti vengono inseriti nel pool di
voto in ordine di tariffa. Nei periodi di alta richiesta è necessario aumentare
questo valore per far accettare i propri biglietti.

**Prezzo del biglietto** Il prezzo attuale di un biglietto calcolato dalla
rete. Cambia ogni 144 blocchi.

**Preferenze VSP** Automatizzare l'impostazione dei Provider di Servizi di Voto
(VSP). Vedi sotto per maggiori informazioni.

**Scadenza (blocchi)** Le tariffe dei biglietti aumentano spesso durante una
finestra attiva e si può essere tenuti fuori da tariffe più alte. Impostando
una scadenza, i biglietti che non sono estratti durante il numero di blocchi
indicato vengono annullati, in modo da poter riprovare con tariffe più elevate
se lo si desidera. Se questo campo è lasciato vuoto, essi non scadranno fino
alla fine della finestra attiva.

**Tariffa Tx (DCR/kB)** Decrediton usa una transazione "split" per evitare di
bloccare il tuo saldo, separando l'importo esatto necessario per il biglietto
dal saldo nel vostro portafoglio. La transazione "split" deve essere confermata
almeno una volta prima di poter riutilizzare il saldo. Questo può bloccare
l'intero saldo per diversi minuti mentre avviene la conferma. Senza lo "split",
dovreste attendere la conferma della transazione del biglietto, che potrebbe
richiedere diverse ore. Può essere lasciata a 0,01. Questo non influisce sulle
vostre possibilità di acquistare biglietti o di votare con loro.

**Indirizzo di voto** L'indirizzo Decred che farà la votazione.

**Indirizzo della tariffa VSP** L'indirizzo a cui sarà pagata la tariffa VSP.

**Tariffe VSP (%)** La percentuale della tariffa che pagherete per l'utilizzo
del servizio VSP.
