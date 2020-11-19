# Informacje o kopii zapasowej portfela LN

Ze względu na charakter sieci drugiej warstwy, dane dotyczące portfela LN **nie** są
przechowywane w samym blockchainie. Oznacza to, że standardowy seed w portfelu
**nie wystarczy** aby przywrócić równowagę portfela LN w przypadku re-seed.

Użytkownicy LN muszą **również** regularnie i bezpiecznie przechowywać plik _SCB file_, aby
odtworzony lightning wallet może być użyty do zamknięcia kanałów otwartych przez
poprzedni portfel.

Kopia zapasowa powinna być aktualizowana za każdym razem, gdy kanał jest otwierany lub zamykany na
lokalnym w węźle LN ( także wtedy, gdy węzeł _remote_ node otwiera kanał z powrotem do lokalnego
węzeła).

Więcej informacji na temat kopii zapasowych LN możesz znaleźć w dokumentacji na stronie
https://docs.decred.org/lightning-network/backups/
