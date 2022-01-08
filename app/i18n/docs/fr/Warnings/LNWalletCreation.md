# Avant de continuer...

Veuillez comprendre que le support de [Lightning Network](https://docs.decred.org/lightning-network/overview/)
est toujours un travail en cours et que vous devez l'utiliser avec précautions.

En particulier :

- Comprendre que les [sauvegardes de données](https://docs.decred.org/lightning-network/backups/) sont nécessaires _en plus de la graine (seed) de votre portefeuille_ pour restaurer tous les fonds LN.

- LN a été implémenté en considérant que les noeuds (portefeuille) sont connectés à internet en permanence, des portefeuilles _épisodiques_ (ceux qui restent connectés que pour une très petite durée) peuvent dégrader la capacité à envoyer et recevoir des paiements.

- Comprendre qu'une contrepartie malveillante pourrait voler les fonds depuis des portefeuilles _épisodiques_ sauf si ceux-ci utilisent un service de [watchtower](https://docs.decred.org/lightning-network/watchtowers/).

- Vous pouvez seulement envoyer et recevoir des paiements jusqu'au montant disponible dans vos canaux publiés, lesquels nécessitent en général 6 confirmations (blocs) pour être disponible.

- Le compte du portefeuille utilisé pour les opérations LN doit rester _non verrouillé_ pendant que le portefeuille LN est démarré, les fonds de ce compte sont potentiellement à risque et accessible par tous ceux qui ont accès à distance ou alors physiquement à l'ordinateur. Il est recommandé d'utiliser un compte séparé (ou mieux, un _portefeuille_ séparé) avec un petit montant pour minimiser le risque.
