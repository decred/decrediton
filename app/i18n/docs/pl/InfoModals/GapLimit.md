# Limit adresów niewykorzystanych

**Ostrzeżenie! Ustawienia limitu adresów niewykorzystanych nie powinny być zmieniane.** Zwiększenie ich może spowodować znaczny spadek wydajności.

Limit adresów niewykorzystanych określa ilość adresów, które portfel wygeneruje i których użycie będzie monitorował. Domyślnie, limit ten jest ustawiony na 20. Oznacza to 2 rzeczy.

1. Kiedy portfel ładuje się po raz pierwszy, wykonuje skanowanie w poszukiwaniu adresów w użyciu i oczekuje, że największa przerwa między adresami będzie wynosić 20;

2. Kiedy portfel generuje użytkownikowi nowe adresy, ich liczba wynosi tylko 20, następnie wraca na początek pętli, co powoduje, że luki pomiędzy adresami nie są większe niż 20.

Tak naprawdę są tylko dwa przypadki, w których należy zmienić tę wartość:

1. Jeśli Twój portfel został stworzony i używany intensywnie przed wersją v1.0, może mieć duże luki adresowe. Jeśli przywrócisz portfel z ziarna i zauważysz, że brakuje w nim środków, możesz zwiększyć ustawienie do 100 (a następnie 1000, jeśli problem wciąż występuje), po czym ponownie uruchomić portfel Decrediton. Po przywróceniu funduszy możesz powrócić do limitu 20 adresów.

2. Jeśli chcesz być w stanie wygenerować więcej niż 20 adresów na raz, bez kolejkowania.
