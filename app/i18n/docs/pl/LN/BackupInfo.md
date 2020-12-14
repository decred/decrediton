# Informacje dot. kopii zapasowej portfela LN

Ze względu na swój charakter aplikacji sieci drugiej warstwy, dane dotyczące portfela LN **nie** są
przechowywane na samym blockchainie. Oznacza to, że standardowe ziarno portfela
**nie wystarczy**, aby przywrócić saldo portfela LN w przypadku potrzeby odtworzenia portfela z ziarna.

Użytkownicy LN **również** muszą regularnie i bezpiecznie przechowywać  _plik SCB_, aby
odtworzony portfel LN mógł zostać użyty do zamknięcia kanałów otwartych przez
poprzedni portfel.

Kopia zapasowa powinna być aktualizowana za każdym razem, gdy kanał jest otwierany lub zamykany na
lokalnym w węźle LN (także wtedy, gdy węzeł _zdalny_ otwiera kanał z powrotem do lokalnego
węzła).

Więcej informacji na temat kopii zapasowych LN możesz znaleźć w dokumentacji na stronie
https://docs.decred.org/lightning-network/backups/
