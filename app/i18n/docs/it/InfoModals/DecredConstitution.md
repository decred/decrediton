# Costituzione di Decred

Decred (/ˈdi:ˈkred/, /dɪˈkred/, dee-cred) è una crittovaluta sicura, adattabile
e autofinanziabile con un sistema di governance basato sulla comunità integrato
nella sua blockchain. La missione del progetto è quella di sviluppare
tecnologie a beneficio del pubblico, con un focus primario sulla tecnologia
della crittovaluta. Questa costituzione definisce un insieme di principi che
guidano il processo decisionale degli stakeholder del progetto, e descrive i
processi attraverso i quali la blockchain e la Tesoreria sono governati. Questo
documento ha lo scopo di gestire le aspettative dei potenziali e attuali utenti
di decred, per far si che essi comprendano più chiaramente il contratto sociale
tra loro e il progetto. Questo documento non intende avere la precedenza sulle
regole di consenso della rete Decred, nel caso di qualsiasi conflitto.

___

### Principi

* *Software libero e open source* - Tutti i software sviluppati come parte di
Decred devono essere liberi e open source.

* *Parlare e riflettere liberamente* - Ognuno ha il diritto di comunicare
opinioni e idee senza timore di censura. Si terrà conto di tutti i discorsi
costruttivi che si basano sui fatti e sulla ragione.

* *Inclusività multi-stakeholder* - L'inclusività rappresenta un sistema
  multi-stakeholder e uno sforzo attivo sarà mantenuto per includere un insieme
  diversificato sia di punti di vista che di utenti.

* *Privacy e sicurezza incrementale* - La privacy e la sicurezza sono delle
  priorità e saranno bilanciate con la complessità delle loro implementazioni.
  Ulteriori tecnologie per la privacy e la sicurezza saranno implementate su
  base continuativa e incrementale, sia in modo proattivo che su richiesta, in
  risposta agli attacchi.

* *Emissione Limitata Fissa* - L'emissione è limitata e l'emissione totale non
deve superare 20.999.999,99800912 DCR, con una sovvenzione per blocco che si
adatta ogni 6.144 blocchi (circa 21,33 giorni) con una riduzione di un fattore
di 100/101. Il sussidio del blocco di genesi inizia a 31,19582664 DCR.

* *Fungibilità universale* - La fungibilità universale è fondamentale per
  Decred, essendo esso un deposito di valore, e gli attacchi nei suoi confronti
  devono essere attivamente monitorati adottando le necessarie contromisure in
  caso di necessità.

___

### Governance della blockchain

* La [governance](https://docs.decred.org/governance/overview/) della rete
  avviene direttamente attraverso la blockchain tramite l'ibridazione della
  proof-of-work del blocco ("PoW") con la sua proof-of-stake ("PoS"). I votanti
  del PoS, noti anche come stakeholder, possono efficacemente scavalcare i
  contribuenti del PoW, noti come miners, se il 50% o più degli stakeholder
  votano contro un particolare blocco creato da un miner.

* Gli stakeholder sono persone che acquistano uno o più biglietti, il che
  comporta il blocco di una specifica quantità di DCR. L'importo di DCR che
  viene bloccato, noto anche come prezzo del biglietto, varia per l'attività
  del sistema tesa a mantenere 40.960 biglietti nel live pool.

* In ogni blocco, 5 biglietti sono chiamati a votare, determinati da un
  [sistema](https://docs.decred.org/proof-of-stake/overview/) a lotteria.
  Quando un biglietto viene chiamato, il portafoglio nominato deve rispondere
  attivamente con un voto. Affinchè un blocco sia accettato dalla rete, esso
  deve contenere i voti di almeno 3 dei 5 biglietti chiamati. La blockchain non
  può essere estesa senza la partecipazione attiva degli stakeholder.

* Gli stakeholder devono attendere una media di 28 giorni (8.192 blocchi) per
  votare i loro biglietti, e durante questo tempo i DCR utilizzati per
  l'acquisto del biglietto rimangono bloccati. L'attesa può essere molto più
  lunga o più breve della media di 28 giorni perchè il processo di selezione
  dei biglietti è pseudocasuale. I biglietti scadono dopo 40.960 blocchi (~142
  giorni) se non chiamati al voto.

* I voti degli stakeholder registrati nella blockchain sono ricompensati con il
  6% di ogni sussidio di blocco, e ogni blocco può avere fino a 5 voti per un
  totale del 30% di ogni sussidio di blocco.

* Il PoW riceve il 60% di ogni sussidio in blocco, con il vincolo che il loro
  sussidio scali linearmente con il numero di voti PoS inclusi: per esempio,
  includendo 3 voti su 5 si riduce il sussidio PoW al 60% del massimo.

* I voti stessi decidono a maggioranza se l'albero di transazione normale del
  blocco precedente, incluso il sussidio PoW, è valido. Quindi, se gli elettori
  del PoS votano contro un particolare blocco del PoW, questo invalida la
  ricompensa del PoW (e la ricompensa della Tesoreria) e invalida qualsiasi
  transazione normale all'interno di quel blocco.

* Il processo Decred per [emendare le regole di
  consenso](https://docs.decred.org/governance/consensus-rule-voting/overview/)
  è anche determinato dal voto degli stakeholder. Il processo inizia quando
  almeno il 95% dei miner PoW e il 75% degli elettori PoS hanno aggiornato il
  loro software a una nuova versione con modifiche latenti alle regole. Una
  volta soddisfatte queste condizioni, inizia un periodo di voto di 8.064
  blocchi (~4 settimane) per decidere se le modifiche latenti delle regole
  debbano essere attivate.

* Per l'approvazione di una proposta di modifica delle regole, almeno il 75%
  dei biglietti non impostati su Astensione deve votare Sì. Se questo requisito
  è soddisfatto e si raggiunge un quorum del 10% dei biglietti che votano Sì o
  No, la modifica della regola sarà attivata 8.064 blocchi (~4 settimane) dopo.

___

### Governance e finanziamento del progetto

* La sostenibilità e la longevità richiedono che il 10% di tutti i premi del
  blocco siano assegnati a un fondo di Tesoreria del progetto, amministrato da
  un'organizzazione di sviluppo.

* L'organizzazione di sviluppo iniziale è *Decred Holdings Group* LLC ("DHG"),
  una LLC di Nevis che è responsabile del finanziamento del lavoro relativo
  allo sviluppo del progetto, come lo sviluppo del software, le infrastrutture
  e la sensibilizzazione. DHG si conformerà a tutte le leggi vigenti delle
  giurisdizioni applicabile, come ad esempio embarghi e altre sanzioni
  commerciali.

* Il progetto mira alla transizione verso un'Organizzazione Autonoma
  Decentralizzata (DAO) che controlla l'erogazione dei fondi della Tesoreria.

* Fino a quando il DHG avrà la responsabilità di gestire la Tesoreria (cioè
  fino a quando il controllo non sarà completamente decentralizzato), esso avrà
  potere di veto che potrà essere esercitato se si ritiene che, in seguito ad
  una decisione, il progetto, l'entità aziendale del DHG o i manager del DHG
  possano essere messi in pericolo.

* Le proposte di
  [Politeia](https://docs.decred.org/governance/politeia/overview/) sono il
  meccanismo attraverso il quale gli stakeholder prendono decisioni politiche e
  approvano i programmi di lavoro. Le proposte di Politeia devono essere
  approvate almeno dal 60% dei biglietti che votano, e almeno il 20% dei
  biglietti idonei devono partecipare al voto. Il periodo di voto predefinito è
  di 2.016 blocchi (~1 settimana).

* I [consulenti](https://docs.decred.org/contributing/overview/) Decred sono
  persone fisiche e giuridiche che lavorano al progetto, in base ad un accordo
  che prevede un compenso per il loro lavoro. I consulenti di Decred sono
  autonomi e non possono essere gestiti direttamente dagli stakeholder.
  Attraverso Politeia, gli stakeholder possono approvare o rifiutare programmi
  di lavoro eseguiti da consulenti specifici, ma non possono imporre ai
  lavoratori di intraprendere determinate azioni.

* Il collettivo dei consulenti Decred è un'entità autoregolante, in cui le
  cellule che lavorano su aspetti specifici risolvono le controversie e
  aggiungono nuovi membri in modo indipendente. Come descritto nella proposta
  approvata [Decred Contractor
  Clearance](https://proposals-archive.decred.org/proposals/fa38a3593d9a3f6cb2478a24c25114f5097c572f6dadf24c78bb521ed10992a4),
  le controversie che non possono essere risolte in modo soddisfacente
  all'interno di un team potranno essere portate al voto di tutti i consulenti,
  una volta che il sistema di gestione dei consulenti, che faciliterà questo
  processo, sarà operativo. Se necessario, le questioni irrisolte potrebbero
  essere sottoposte al voto degli stakeholder come autorità decisionale finale.

* La volontà degli stakeholder, espressa attraverso il loro voto di biglietti
  on-chain e Politeia, è la forza decisionale definitiva per il progetto.

* Questa costituzione sarà ratificata da un voto Politeia prima che entri in
  vigore, e può essere ulteriormente modificata con l'approvazione di
  successive proposte di Politeia.
