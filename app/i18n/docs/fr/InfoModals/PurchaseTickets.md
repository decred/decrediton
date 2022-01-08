# Informations sur l'achat de Tickets

**Compte** Le compte qui va acheter les tickets et recevoir la récompense suite aux votes.

**Nombre de tickets** Le nombre de tickets qui doit être acheté.

**Frais de Ticket (DCR/kB)** Les tickets entrent dans le pool de vote et sont ordonnés en fonction de leur frais. En période de forte demande, vous devrez augmenter cette valeur pour voir vos achats de tickets acceptés.

**Prix du Ticket** Le prix actuel du ticket calculé par le réseau.  Change tous les 144 Blocs.

**Préférences VSP** Automatise le paramétrage des Voting Service Providers (Fournisseurs de Service de Vote). Voir ci-dessous pour plus d'informations.

**Expiration (blocs)** Les frais de tickets peuvent augmenter durant la fenêtre d'achat et vous pourriez être bloqué par des frais trop élevés. En paramétrant une expiration, les tickets qui ne sont pas minés durant un nombre de blocs définis sont annulés et vous pourrez alors réessayer de les acheter à nouveau avec des frais plus élevés si vous le souhaitez. Si ce paramètre est vide, les tickets n'expireront pas avant la fin de la fenêtre d'achat.

**Frais de Transaction (DCR/kB)** Decrediton utilises une transaction "split" (séparée) pour éviter de bloquer votre balance, séparant exactement le montant nécessaire pour acheter le ticket du solde de votre portefeuille. La transaction de "split" a besoin d'être confirmée au moins une fois avant que vous puissiez réutiliser votre solde. Elle peut bloquer vos fonds pour plusieurs minutes le temps que la confirmation arrive. Sans le 'split', vous auriez dû attendre la confirmation de la transaction du ticket qui peut prendre plusieurs heures. Le paramètre peut être conservé à 0.01. Il n'affecte pas vos chances d'acheter des tickets ou de voter.

**Adresse de Vote** L'adresse Decred qui sera utilisée pour le vote.

**Adresse frais VSP** L'adresse de votre VSP qui sera utilisée pour payer les frais.

**Frais VSP (%)** Le pourcentage de frais que vous allez payer pour utiliser le service du VSP.
