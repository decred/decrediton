# Informacje o kopii zapasowej portfela LN

Ze względu na swój charakter sieci drugiej warstwy, dane dotyczące portfela LN **nie** są
przechowywane na samym blockchainie. Oznacza to, że standardowe ziarno portfela
**nie wystarczy**, aby przywrócić saldo portfela LN w przypadku potrzeby przywrócenia portfela z ziarna.

Oprócz ziarna portfela, użytkownicy LN **również** muszą regularnie i bezpiecznie przechowywać _plik SCB_, aby
odtworzony portfel lightning mógł być użyty do zamknięcia kanałów otwartych przez
poprzedni portfel.

Kopia zapasowa powinna być aktualizowana za każdym razem, gdy kanał jest otwierany lub zamykany na
lokalnym w węźle LN (także wtedy, gdy _węzeł zdalny_ otwiera kanał z powrotem do lokalnego
węzła).

Więcej informacji na temat kopii zapasowych LN znajdziesz w dokumentacji na stronie
https://docs.decred.org/lightning-network/backups/
