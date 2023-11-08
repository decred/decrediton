# Informations sur l'Achat Automatique

**Solde à maintenir** Si votre solde est plus bas que cette valeur, il n'y aura pas d'achat de tickets. Le solde à maintenir par défaut est de 0 et va donc utiliser tous les fonds de votre compte pour acheter des tickets.

**Frais Max** Les tickets sont ajoutés au mempool et priorisés en fonction des frais payés par kilo-octet. Cette valeur détermine les frais maximums que vous souhaitez payer par ticket.

**Prix Maximum Absolu** Si le prix courant des tickets est supérieur à cette valeur, vous n'allez plus acheter de tickets supplémentaires. La configuration par défaut est de 0 et désactive ce comportement.

**Prix Maximum Relatif** Cette valeur permet de calculer le prix maximum d'achat des tickets qui est obtenu en multipliant le prix moyen observé pour les tickets par la valeur configurée. Par exemple, si le prix moyen est 100, et que le prix maximum relatif est établi à 1.25, alors le prix maximum pour acheter des tickets sera de 125 DCR.

**Max Par Bloc** Nombre maximum de tickets achetés par bloc. Si un nombre négatif est spécifié il déclenche l'achat d'un ticket tous les n blocs. Par exemple -2 déclenche l'achat d'un ticket tous les deux blocs.
