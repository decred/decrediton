# Konstytucja Decred

Decred (/ˈdi:ˈkred/, /dɪˈkred/, dee-cred) jest bezpieczną, adaptowalną i samofinansującą się kryptowalutą z społecznym systemem zarządzania zintegrowanym z blockchainem. Misją projektu jest opracowanie technologi dla dobra publicznego, ze szczególną rolą kryptowalut. Konstytucja ta określa zbiór zasad, które kierują podejmowaniem decyzji przez interesariuszy projektu oraz opisuje procesy, za pomocą których zarządzany jest blockchain i budżet projektu. Dokument ten ma na celu zarządzanie oczekiwaniami potencjalnych i faktycznych użytkowników Decreda, tak aby lepiej rozumieli oni umowę społeczną między sobą a projektem. Niniejszy dokument nie ma mieć pierwszeństwa przed zasadami konsensusu sieci Decred w przypadku wystąpienia jakiegokolwiek konfliktu.

---

### Zasady

- _Wolne i otwarte oprogramowanie_ - Wszystkie programy opracowane w ramach projektu Dekret są i pozostaną wolne w oparciu o zasady wolnego oprogramowania (open source-software).
- _Wolność słowa i rozważań_ - Każdy ma prawo do wyrażania opinii i idei bez obawy przed cenzurą. Należy brać pod uwagę wszystkie konstruktywne wypowiedzi, które oparte są o fakty i rozsądek.
- _Integralność zainteresowanych stron_ - Systemem zapewnia integralność wszystkich zainteresowanych stron, podejmowany jest aktywny wysiłek na rzecz uwzględnienia zróżnicowanych użytkowników i poglądów.
- _Stopniowalna ochrona prywatności i bezpieczeństwa_ - Prywatność i bezpieczeństwo są priorytetami i należy zrównoważyć złożoność ich realizacji. Dodatkowe technologie ochrony prywatności i bezpieczeństwa są wdrażane w sposób ciągły i stopniowy, zarówno aktywnie, jak i na żądanie, w odpowiedzi na ataki.
- _Stały skończony podaż_ - Emisja jest ograniczona i nie przekroczy 20 999 999 99800912 DCR, z dotacją na każdy blok, która dostosowuje się co 6 144 bloki (około 21,33 dni) poprzez zmniejszenie w oparciu o współczynnik 100/101. Dotacje bloku genesis rozpoczyna się w 31.19582664 dniu DCR.
- _Uniwersalna zamienność_ - Uniwersalna zamienność ma fundamentalne znaczenie dla Dekretu jako magazynu wartości, a ataki na nią są aktywnie monitorowane i w razie potrzeby podejmowane są środki zaradcze.

---

### Zarządzanie Blockchainem

- [Zarządzanie](https://docs.decred.org/governance/overview/) siecią odbywa się bezpośrednio w blockchainie poprzez hybrydyzację bloków proof-of-work (&ldquo;PoW&rdquo;) z proof-of-stake (&ldquo;PoS&rdquo;). Wyborcy PoS, znani również jako interesariusze, mogą skutecznie unieważnić udziałowców PoW, znanych jako minerzy, jeśli 50% lub więcej interesariuszy zagłosuje przeciwko blokowi stworzonemu przez konkretnego minera.
- Interesariusze to osoby, które kupują jeden lub więcej biletów, co wiąże się z zablokowaniem określonej ilości DCR. Kwota DCR, która musi być zablokowana, znana również jako cena biletu, zmienia się, ponieważ system celuje w obrót 40.960 biletami w puli.
- W każdym bloku, 5 biletów jest powoływanych do głosowania, jest to wyznaczane przez loterię [system](https://docs.decred.org/proof-of-stake/overview/). Przy wyznaczaniu losu, nominowany portfel musi aktywnie odpowiedzieć głosem. Aby blok został przyjęty przez sieć, musi zawierać głosy z co najmniej 3 z 5 wywołanych losów. Blockchain nie może być rozbudowywany bez aktywnego udziału interesariuszy.
- Interesariusze muszą czekać średnio 28 dni (8 192 bloki), aby zagłosować swoimi biletami, a w tym czasie DCR użyte do zakupu biletu pozostają zablokowane. Czas oczekiwania może być znacznie dłuższy lub krótszy niż średnia 28 dni, ponieważ proces selekcji biletów jest pseudolosowy. Bilety tracą ważność po 40.960 blokach (~142 dni), jeśli nie zostaną wezwane do głosowania.
- Głosy interesariuszy zarejestrowane w blockchainie są nagradzane 6% wartości każdej dotacji blokowej, a każdy blok może mieć do 5 głosów o łącznej wartości 30% każdej dotacji blokowej.
- PoW otrzymuje 60% dotacji za każdy blok, pod warunkiem, że jego dotacja skaluje się liniowo z uwzględnieniem liczby głosów PoS, np. włączenie 3 z 5 głosów zmniejsza dotację PoW do 60% z maksimum.
- Głosy same decydują w oparciu o większość, o tym czy drzewo transakcji z poprzedniego bloku, w tym dotacja PoW, są ważne. Tak więc, jeżeli wyborcy PoS zagłosują przeciwko danemu blokowi PoW, unieważnia to nagrodę PoW (i nagrodę za udział w głosowaniu) oraz wszelkie transakcje w tym bloku.
- Proces Decreda dla [zmiany zasad konsensusu](https://docs.decred.org/governance/consensus-rule-voting/overview/) jest również sterowany przez głosowanie zainteresowanych stron. Proces rozpoczyna się, gdy co najmniej 95% minerów z PoS i 75% wyborców z PoS zaktualizuje swoje oprogramowanie do nowej wersji z ukrytymi zmianami w zasadach. Po spełnieniu tych warunków, rozpoczyna się okres głosowania 8,064 bloków (~4 tygodnie), aby zdecydować, czy należy aktywować ukryte zmiany reguł.
- Aby wniosek w sprawie zmiany zasad został zatwierdzony, co najmniej 75% biletów, które nie zostały wyłączone z głosowania, musi na Tak. Jeśli ten wymóg jest spełniony, a kworum 10% biletów głosujących Tak lub Nie zostanie osiągnięte, wówczas zmiana reguły zostanie aktywowana 8.064 bloków (~4 tygodnie) później.

---

### Zarządzanie projektem i finansowanie

- Trwałość i długowieczność wymagają, aby 10% wszystkich nagród za bloki było przekazywane na fundusz finansowania projektu, administrowany przez organizację deweloperską.
- Pierwotna organizacja deweloperska to _Decred Holdings Group_ LLC (&ldquo;DHG&rdquo;), Nevis LLC, która jest odpowiedzialna za finansowanie prac związanych z rozwojem projektu, takich jak rozwój oprogramowania, infrastruktury i świadomości. DHG stosuje się do wszystkich odpowiednich przepisów prawa w odpowiednich jurysdykcjach, takich jak embarga i inne sankcje handlowe.
- Projekt ma na celu przejście na Zdecentralizowaną Organizację Autonomiczną - Decentralized Autonomous Organization (DAO), która kontroluje wydatkowanie środków pochodzących z budżetu projektu.
- Tak długo, jak DHG jest odpowiedzialne za zarządzanie budżetem projektu (tzn. do czasu pełnej decentralizacji kontroli), posiada prawo weta, które może zostać wykorzystane, jeżeli uzna, że kontynuacja decyzji zagroziłaby realizacji projektu, spółce DHG lub osobom zarządzającym DHG.
- [Politeia](https://docs.decred.org/governance/politeia/overview/) - propozycje w systemie Politeia są mechanizmem, za pomocą którego zainteresowane strony podejmują decyzje dotyczące polityki i zatwierdzają programy działań. Propozycje Politeia muszą być zatwierdzone przez co najmniej 60% głosujących, a co najmniej 20% kwalifikujących się biletów musi uczestniczyć w głosowaniu. Domyślny okres głosowania wynosi 2 016 bloków (~1 tydzień).
- [Wykonawcy Decreda](https://docs.decred.org/contributing/overview/) to osoby fizyczne i korporacje, które pracują nad projektem, na podstawie umowy, że otrzymują wynagrodzenie za swoją pracę. Wykonawcy Decreda są autonomiczni, nie mogą być bezpośrednio zarządzani przez interesariuszy. Za pośrednictwem Politei, interesariusze mogą zatwierdzać lub odrzucać programy pracy wykonywane przez konkretnych wykonawców, ale nie mogą zlecać pracownikom podejmowania określonych działań.
- Kolektyw wykonawców Decreda jest jednostką samoregulującą się, w której komórki pracujące nad konkretnymi aspektami rozwiązują spory i dodają nowych członków niezależnie. Jak opisano w zatwierdzonej [Propozycji rozliczenia wykonawców Decreda](https://proposals-archive.decred.org/proposals/fa38a3593d9a3f6cb2478a24c25114f5097c572f6dadf24c78bb521ed10992a4), spory, które nie mogą być zadowalająco rozwiązane w zespole, mogą być eskalowane do głosowania wszystkich wykonawców - po uruchomieniu systemu zarządzania wykonawcami, który ma za zadanie usprawnienie tego procesu. W razie potrzeby, nierozwiązane kwestie mogą być dalej eskalowane do głosowania zainteresowanych stron jako ostatecznego organu decyzyjnego.
- Wola interesariuszy, wyrażona poprzez głosowanie z użyciem biletów Politea w sieci blockchain, jest ostateczną siłą decyzyjną projektu.
- Ta konstytucja zostanie zatwierdzona w drodze głosowania w systemie Politeia zanim wejdzie w życie, może zostań zmieniona poprzez zatwierdzenie kolejnych wniosków z sysyemy Politea.
