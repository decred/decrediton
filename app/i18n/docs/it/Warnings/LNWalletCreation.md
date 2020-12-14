# Prima di continuare...

Si prega di comprendere che il lavoro sul [Lightning Network](https://docs.decred.org/lightning-network/overview/)
è ancora in corso e deve essere usato con cautela. In particolare:

- Comprendete che [il backup dei dati](https://docs.decred.org/lightning-network/backups/) è necessario _in aggiunta al vostro seed del portafoglio_ per recuperare tutti i fondi LN.

- LN è stato implementato presupponendo che i nodi (portafogli) siano online per la maggior parte del tempo, quindi i portafogli _episodici_ (quelli che rimangono online per pochissimo tempo) potrebbero avere ridotta capacità di invio e ricezione dei pagamenti.

- Comprendete che una controparte malintenzionata potrebbe rubare fondi da portafogli _episodici_ a meno che non utilizzino un servizio [watchtower](https://docs.decred.org/lightning-network/watchtowers/).

- È possibile inviare e ricevere pagamenti solo fino all'importo disponibile nei propri canali pubblicati, il che solitamente richiede fino a 6 conferme (blocchi) per essere disponibile.

- Il conto del portafoglio utilizzato per le operazioni LN rimane _sbloccato_ mentre il portafoglio LN è in funzione, quindi i fondi di quel conto sono a rischio da chiunque abbia accesso remoto o fisico al vostro computer. Si consiglia di usare un conto separato (o meglio ancora, un _portafoglio_ separato) con una piccola quantità di fondi per minimizzare il rischio.
