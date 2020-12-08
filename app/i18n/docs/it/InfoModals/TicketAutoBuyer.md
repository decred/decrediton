# Informazioni sull'acquisto automatico

**Saldo da Mantenere** Se il vostro saldo è inferiore a questo valore, non
potrete comprare biglietti. Il valore predefinito di 0 userà tutti i fondi del
vostro conto per acquistare biglietti.

**Tariffa massima** I biglietti vengono inseriti nel mempool in ordine di
tariffa per kilobyte. Questo stabilisce la tariffa massima che si è disposti a
pagare.

**Prezzo massimo assoluto** Se il prezzo del biglietto è superiore a questo
valore, non si potranno più acquistare biglietti. Il valore predefinito di 0
disattiva questa opzione.

**Prezzo massimo relativo** Questo valore stabilisce il prezzo massimo per
l'acquisto di biglietti, in base al prezzo medio osservato moltiplicato per
questo numero. Ad esempio, se il prezzo medio è 100 e questo è stato impostato
a 1,25, allora il prezzo massimo per l'acquisto dei biglietti sarà di 125
DCR.

**Massimo per blocco** Non acquistare più di questo numero di biglietti per
blocco. Un numero negativo significa acquistare un biglietto ogni n blocchi: ad
esempio, -2 significa acquistare un biglietto ogni due blocchi.
