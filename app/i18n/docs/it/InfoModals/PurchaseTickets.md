# Informazioni sull'acquisto del biglietto

**Conto** È il conto che acquisterà i biglietti e riceverà la ricompensa.

**Numero di biglietti** Il numero di biglietti per cui tentare l'acquisto.

**Tassa del biglietto (DCR/kB)** I biglietti vengono inseriti nel pool di voto secondo l'ordine della loro tassa. Nei periodi di richiesta, è necessario aumentare questo valore per avete i tuoi biglietti accettati.

**Prezzo del biglietto** Il prezzo attuale di un biglietto calcolato dalla rete.  Cambia ogni 144 blocchi.

**Preferenze VSP** Automatizzare l'impostazione con i Provider di Servizi di Voto(VSP). Vedi sotto per maggiori informazioni.

**Scadenza (blocchi)** Le tasse dei biglietti aumentano spesso durante una finestra attiva e si può essere fermati da tariffe più alte. Impostando una scadenza, i biglietti che non sono estratti durante il numero di blocchi indicato vengono cancellati, in modo da poter riprovare con tariffe più elevate, se lo si desidera. Se questo è lasciato vuoto, non scadranno fino alla fine della finestra.

**Tassa Tx (DCR/kB)** Decrediton utilizza una transazione "split" per evitare di bloccare il tuo saldo, dividendo l'importo necessario esatto per il biglietto dal saldo nel tuo portafoglio. La transazione "split" deve essere confermata almeno una volta prima di poter riutilizzare il saldo. Questo può bloccare l'intero saldo per diversi minuti mentre avviene la conferma. Senza la suddivisione, dovreste attendere la conferma della transazione del biglietto, che potrebbe richiedere diverse ore. 
Può essere lasciata a 0,01. Questo non influisce sulle vostre possibilità di acquistare biglietti o di votare con loro.

**Indirizzo di voto** L'indirizzo Decred che farà la votazione.

**Indirizzo della tassa VSP** L'indirizzo a cui sarà pagata la tassa VSP.

**Tasse VSP (%)** La percentuale della tassa che pagherete per l'utilizzo del servizio VSP.