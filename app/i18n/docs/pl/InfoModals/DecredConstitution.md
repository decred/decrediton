# Konstytucja Decred

Decred (/ˈdi:ˈkred/, /dɪˈkred/, dee-cred) jest bezpieczną, adaptowalną i samofinansującą się kryptowalutą z systemem zarządzania przez społeczność, który jest zintegrowany z blockchainem. Misją projektu jest opracowanie technologii dla dobra publicznego, skupiając się szczególnie na technologii kryptowalut. Konstytucja ta określa zbiór zasad, którymi kierują się interesariusze projektu podczas podejmowania decyzji oraz opisuje procesy, za pomocą których zarządzany jest blockchain i budżet projektu. Dokument ten ma na celu zarządzanie oczekiwaniami potencjalnych i faktycznych użytkowników Decred tak, aby lepiej rozumieli oni umowę społeczną zawartą między sobą a projektem. Niniejszy dokument nie ma pierwszeństwa przed zasadami konsensusu sieci Decred w przypadku wystąpienia jakiegokolwiek konfliktu.

---

### Zasady

- _Wolne i otwarte oprogramowanie_ - Wszystkie programy opracowane w ramach projektu Decred są i pozostaną oprogramowaniem typu otwartego źródła.
- _Wolność słowa i rozważań_ - Każdy ma prawo do wyrażania opinii i idei bez obawy przed cenzurą. Brane będą pod uwagę wszystkie konstruktywne wypowiedzi, które oparte są na faktach i rozsądku.
- _Inkluzywność i zachowanie pluralizmu interesariuszy_ - System zapewnia inkluzywność wszystkich stron zaangażowanych w projekt i podejmowany jest aktywny wysiłek na rzecz utrzymania zróżnicowania użytkowników i poglądów.
- _Zwiększająca się ochrona prywatności i bezpieczeństwa_ - Prywatność i bezpieczeństwo są priorytetami i należy zrównoważyć ich złożoność oraz sposób implementacji. Dodatkowe technologie ochrony prywatności i bezpieczeństwa będą wdrażane w sposób ciągły i stopniowy, zarówno aktywnie, jak i na żądanie, w odpowiedzi na ataki.
- _Stała i określona podaż_ - Emisja jest ograniczona i nie przekroczy 20 999 999 99800912 DCR, z dotacją na każdy blok, która dostosowywana jest co 6144 bloków (około 21,33 dni) poprzez zmniejszenie w oparciu o współczynnik 100/101. Dotacja bloku początkowego (genesis) zaczyna się od 31,19582664 DCR.
- _Uniwersalna zamienność_ - Uniwersalna zamienność ma fundamentalne znaczenie dla projektu Decred jako środka przechowania wartości, a ataki na nią będą aktywnie monitorowane i w razie potrzeby podejmowane będą środki zaradcze.

---

### Zarządzanie Blockchainem

- [Zarządzanie](https://docs.decred.org/governance/overview/) siecią odbywa się bezpośrednio na blockchainie poprzez hybrydyzację systemów weryfikacji bloków proof-of-work (&ldquo;PoW&rdquo;) z proof-of-stake (&ldquo;PoS&rdquo;). Wyborcy PoS, znani również jako interesariusze, mogą skutecznie unieważnić udziałowców PoW, znanych jako górników, jeśli 50% lub więcej interesariuszy zagłosuje przeciwko blokowi stworzonemu przez konkretnego górnika.
- Interesariusze to osoby, które kupują jeden lub więcej biletów, co wiąże się z zablokowaniem określonej ilości DCR. Kwota DCR, która musi być zablokowana, znana również jako cena biletu, zmienia się, ponieważ system celuje w utrzymanie puli biletów w ilości 40960 sztuk.
- W każdym bloku 5 biletów jest wywoływanych do głosowania, o czym decyduje [system loteryjny](https://docs.decred.org/proof-of-stake/overview/). Przy wywołaniu przez mechanizm nominowany portfel musi aktywnie odpowiedzieć oddaniem głosu. Aby blok został przyjęty przez sieć, musi zawierać głosy z co najmniej 3 z 5 wywołanych biletów. Łańcuch blokowy nie może być rozbudowywany bez aktywnego udziału interesariuszy.
- Interesariusze muszą czekać średnio 28 dni (8192 bloki), aby ich bilety oddały głos, a w tym czasie DCR użyte do zakupu biletu pozostają zablokowane. Czas oczekiwania może być znacznie dłuższy lub krótszy niż średnia 28 dni, ponieważ proces selekcji biletów jest pseudolosowy. Bilety tracą ważność po 40960 blokach (~142 dni), jeśli nie zostaną wezwane do głosowania.
- Głosy interesariuszy zarejestrowane na blockchainie są nagradzane 6% wartości każdej nagrody blokowej, a każdy blok może mieć do 5 głosów o łącznej wartości 30% każdej nagrody blokowej.
- PoW otrzymuje 60% nagrody za każdy blok, pod warunkiem, że nagroda ta skaluje się liniowo z uwzględnieniem liczby głosów PoS, np. włączenie 3 z 5 głosów zmniejsza dotację PoW do 60% z maksimum.
- Głosy same decydują w oparciu o większość, o tym, czy drzewo transakcji z poprzedniego bloku, w tym dotacja PoW, są ważne. Tak więc, jeżeli wyborcy PoS zagłosują przeciwko danemu blokowi PoW, unieważnia to nagrodę PoW (i dotację do Skarbca) oraz wszelkie zwykłe transakcje zawarte w tym bloku.
- Proces [zmiany zasad konsensusu](https://docs.decred.org/governance/consensus-rule-voting/overview/) sieci Decred jest również sterowany przez głosowanie interesariuszy. Proces rozpoczyna się, gdy co najmniej 95% górników PoW i 75% głosujących PoS zaktualizuje swoje oprogramowanie do nowej wersji z uwzględnionymi zmianami w zasadach konsensusu. Po spełnieniu tych warunków rozpoczyna się okres głosowania trwający 8064 bloków (~4 tygodnie), aby zdecydować, czy należy aktywować nowe zasady konsensusu zawarte w kodzie.
- Aby wniosek w sprawie zmiany zasad został zatwierdzony, co najmniej 75% biletów, które nie wstrzymały się od głosowania, musi oddać głos na „tak”. Jeśli ten wymóg zostanie spełniony, a kworum 10% biletów głosujących na „tak” lub „nie” zostanie osiągnięte, wówczas zmiana reguły zostanie aktywowana 8064 bloków (~4 tygodnie) później.

---

### Zarządzanie projektem i finansowanie

- Trwałość i długowieczność wymagają, aby 10% wszystkich nagród za wydobycie bloków było przekazywane do Skarbca projektu, którym zarządza organizacja rozwoju.
- Pierwotna organizacja rozwoju to _Decred Holdings Group_ LLC (&ldquo;DHG&rdquo;), spółka z o. o. na Nevis, która jest odpowiedzialna za finansowanie prac związanych z rozwojem projektu, takich jak rozwój oprogramowania, infrastruktury i świadomości marki. DHG stosuje się do wszystkich odpowiednich przepisów prawa w odpowiednich jurysdykcjach, takich jak embarga i inne sankcje handlowe.
- Projekt ma na celu przejście na Zdecentralizowaną Organizację Autonomiczną (Decentralized Autonomous Organization - DAO), która kontroluje wydatkowanie środków pochodzących ze Skarbca projektu.
- Tak długo, jak DHG jest odpowiedzialne za zarządzanie Skarbcem projektu (tzn. do czasu pełnej decentralizacji kontroli), posiada prawo weta, które może zostać wykorzystane, jeżeli uzna, że kontynuacja decyzji zagroziłaby realizacji celów projektu, spółce DHG lub osobom zarządzającym DHG.
- Propozycje na platformie [Politeia](https://docs.decred.org/governance/politeia/overview/) są mechanizmem, za pomocą którego interesariusze podejmują decyzje dotyczące polityki i zatwierdzają programy działań. Propozycje Politeia muszą być zatwierdzone przez co najmniej 60% głosujących, przy udziale co najmniej 20% biletów kwalifikujących się do głosowania. Domyślny okres głosowania wynosi 2016 bloków (~1 tydzień).
- [Wykonawcy Decred](https://docs.decred.org/contributing/overview/) to osoby fizyczne i korporacje, które pracują nad projektem, na podstawie umowy oświadczającej, że otrzymują wynagrodzenie za swoją pracę. Wykonawcy Decred są niezależni i nie mogą być bezpośrednio zarządzani przez interesariuszy. Za pośrednictwem Politei, interesariusze mogą zatwierdzać lub odrzucać programy pracy wykonywane przez konkretnych wykonawców, ale nie mogą zlecać pracownikom podejmowania określonych działań.
- Kolektyw wykonawców Decred jest jednostką samoregulującą się, w której komórki pracujące nad konkretnymi aspektami niezależnie rozwiązują spory i dodają nowych członków. Jak opisano w zatwierdzonej [propozycji dot. licencji wykonawców Decred](https://proposals-archive.decred.org/proposals/fa38a3593d9a3f6cb2478a24c25114f5097c572f6dadf24c78bb521ed10992a4), spory, które nie mogą być zadowalająco rozwiązane w zespole, mogą być eskalowane do głosowania wszystkich wykonawców - po uruchomieniu systemu zarządzania wykonawcami, który ma za zadanie usprawnienie tego procesu. W razie potrzeby nierozwiązane kwestie mogą być dalej eskalowane do głosowania interesariuszy jako ostatecznego organu decyzyjnego.
- Wola interesariuszy, wyrażona poprzez głosowanie na łańcuchu dzięki wykorzystaniu biletów Politeia, jest ostateczną siłą decyzyjną projektu.
- Ta konstytucja zostanie zatwierdzona w drodze głosowania w systemie Politeia, zanim wejdzie w życie i może ulec zmianom poprzez zatwierdzenie kolejnych propozycji z platformy Politeia.
