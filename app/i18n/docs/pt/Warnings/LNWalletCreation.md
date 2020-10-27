# Antes de criar uma carteira LN

A [Lightning Network](https://docs.decred.org/lightning-network/overview/) ainda é um trabalho em progresso na Decred.

Embora seja baseada na implementação `lnd`, ela tem diferenças significativas e teve testes menos amplos que a LN da Bitcoin, portanto utilize com cuidado.

Em particular:

- Entenda que [backups](https://docs.decred.org/lightning-network/backups/) são necessários _em adição à seed_ para recuperar todos os fundos da LN.

- A LN é implementada assumindo que os nós (carteiras) permanecem online a maior parte do tempo, portanto carteiras _episódicas_ (aquelas que permanecem online por pouco tempo de cada vez) podem ter sua habilidade de enviar e receber pagamentos degradada.


- Entenda que uma contraparte maliciosa pode roubar fundos de carteiras _episódicas_ a não ser que elas utilizem um serviço de [watchtowers](https://docs.decred.org/lightning-network/watchtowers/)

- Você só pode enviar e receber pagamentos até o total disponível nos seus canais publicados, o que normalmente requer até 6 confirmações (blocos) na rede para torná-los disponíveis.

- A conta correspondente usada para operações da LN é mantida _destrancada_ enquanto a carteira LN está em execução, portanto fundos dessa conta estão sob risco por qualquer um que tenha acesso remoto ou físico ao computador.

Uma recomendação é usar uma conta exclusiva (ou melhor ainda, uma _carteira_ exclusiva) com uma quantidade pequena de fundos para minimizar a possibilidade de perda de fundos.
