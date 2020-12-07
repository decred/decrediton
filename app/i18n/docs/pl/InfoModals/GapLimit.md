# Limit rozbieżności

**Ostrzeżenie! Ustawienie granicy rozbieżności nie powinno być zmieniane.** Zwiększenie granicy rozbieżności może spowodować znaczny spadek wydajności.

Limit rozbieżności określa ilość adresów, które portfel wygeneruje i przeprowadzi prognozy, aby określić wykorzystanie. Domyślnie, limit rozbieżności jest ustawiony na 20. Oznacza to 2 rzeczy.

1. Kiedy portfel ładuje się po raz pierwszy, skanuje w poszukiwaniu adresów w użycia i oczekuje, że największa przerwa między adresami będzie wynosić 20;

2. Kiedy użytkownik otrzymuje nowo wygenerowane adresy, ich liczba wynosi tylko 20, następnie portfel wykonuje tą operację ponownie co powoduje, że luki pomiędzy adresami nie są większe niż 20.

Tak naprawdę są tylko dwa przypadki w których należy zmienić tę wartość:

1. Jeśli twój portfel został stworzony i używany intensywnie przed v1.0, może mieć duże luki adresowe. Jeśli przywracasz portfel z seeda i zauważysz, że brakuje funduszy, możesz zwiększyć ustawienie do 100 (następnie 1000 jeśli problem wciąż występuje), a następnie ponownie uruchom Decrediton. Po przywróceniu funduszy możesz powrócić do 20.

2. Jeśli chcesz być w stanie wygenerować więcej niż 20 adresów na raz, bez kolejkowania.
