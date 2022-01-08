# Limite d'intervalle

**Avertissement ! Le paramétrage de la limite d'intervalle (gap limit) doit le plus souvent ne pas être modifié.**  Une augmentation de la limite d'intervalle pourrait entrainer une perte de performances importante.

La limite d'intervalle paramètre le nombre d'adresses que le portefeuille va générer et observer pour déterminer son utilisation. Par défaut, la limite est à 20. Ce qui implique deux choses.

  1. Lorsque le portefeuille se charge la première fois, il recherche les adresses utilisées et s'attend à avoir un intervalle de 20 entre les adresses au maximum.

  2. Lorsque le portefeuille fournira des nouvelles adresses générées à l'utilisateur il n'en donnera que 20 et reviendra ensuite en arrière pour s'assurer de n'avoir aucun intervalle supérieur à 20.

Il n'y a que deux raisons qui pourraient vous faire changer la limite d'intervalle :

  1. Si votre portefeuille a été créé et utilisé énormément avant la v1.0, il pourrait alors avoir de grands intervalles entre les adresses.  Si vous restaurez depuis la graine (seed) et constatez que des fonds sont manquants, vous pouvez augmenter la limite d'intervalle à 100 (et même 1000 si le problème continue) ensuite redémarrez Decrediton.  Dès que votre solde est correct vous pouvez remettre la limite d'intervalle à 20.

  2. Si vous souhaitez être capable de générer plus de 20 adresses en une fois sans répétitions.
