# Informations sur la sauvegarde du portefeuille LN

De par sa nature de seconde couche du réseau, les données de portefeuille LN **ne sont pas**
sauvegardées dans la blockchain. La graine (seed) de portefeuille **n'est pas suffisante**
pour restaurer le solde LN d'un portefeuille.

Les utilisateurs LN doivent **aussi** régulièrement que possible et de façon sécurisée sauvegarder
le _fichier SCB_ pour qu'une restauration du portefeuille LN puisse être faite en cas de nécessité
et pour fermer les canaux ouverts précédemment.

Il est recommandé de mettre à jour votre sauvegarde à chaque fois qu'un canal est ouvert ou fermé
sur le noeud LN local (en incluant le cas où un noeud _distant_ ouvre un canal vers le noeud local).

Pour plus d'informations sur les sauvegardes LN, veuillez consulter la documentation sur
https://docs.decred.org/lightning-network/backups/
