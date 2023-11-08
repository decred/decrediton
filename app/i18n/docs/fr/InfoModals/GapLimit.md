# Limite d'intervalle

**Avertissement ! La valeur de la limite d'intervalle (gap limit) doit le plus souvent ne pas être modifié.**  Une augmentation de la limite d'intervalle pourrait entrainer une perte de performances importante.

La limite d'intervalle spécifie le nombre d'adresses que le portefeuille va générer et observer pour déterminer son utilisation. Par défaut, la limite est à 20. Ce qui implique deux choses.

  1. Lorsque le portefeuille se charge la première fois, il recherche les adresses utilisées et s'attend à voir un intervalle de 20 entre les adresses au maximum.

  2. Lorsque le portefeuille fournira des nouvelles adresses générées à l'utilisateur, il n'en donnera que 20 et reviendra ensuite en arrière pour s'assurer de n'avoir aucun intervalle supérieur à 20.

Il n'y a que deux raisons qui pourraient rendre nécessaire le changement de la limite d'intervalle :

  1. Si votre portefeuille a été créé et utilisé à grande fréquence avant la v1.0, il pourrait alors y avoir de grands intervalles entre les adresses.  Si vous restaurez depuis la graine (seed) et constatez que des fonds sont manquants, vous pouvez augmenter la limite d'intervalle à 100 (et même 1000 si le problème continue) ensuite redémarrer Decrediton.  Dès que votre solde est corrigé vous pouvez remettre la limite d'intervalle à 20.

  2. Si vous souhaitez être capable de générer plus de 20 adresses à la fois sans répétitions.
