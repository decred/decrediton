# Informações sobre Compra de Tickets

**Conta** Essa é a conta que vai comprar tickets e receber a recompensa

**Número de Tickets** The number of tickets to attempt to purchase.

**Taxa de Ticket (DCR/kB)** Tickets entram na pool de votação na ordem de sua taxa. Em tempos de alta demanda você poderá precisar aumentar esse valor para ter seus tickets aceitos. Você pode ver a taxa de tickets atual aqui.

**Preço do Ticket** O preço atual de um ticket, conforme calculado pela rede. Muda a cada 144 blocos.

**Stakepool Preferida** Automatizar o setup com pools. Veja abaixo.

**Expiração (blocks)** É comum que a taxa de tickets aumente durante uma janela e que você seja impedido de comprar por outras pessoas com taxas maiores. Configurando uma expiração, tickets não minerados na quantidade de blocos especificada como expiração são cancelados para que você possa tentar novamente com taxas mais altas se quiser. Se esse campo ficar em branco, os tickets não vão expirar até o fim da janela.

**Taxa de Tx (DCR/kB)** Decrediton usa uma transação "split" para evitar bloquear o seu saldo, dividindo o valor exato necessário para a compra do ticket do saldo da sua carteira. Essa transação "split" precisa ser confirmada pelo menos uma vez para que você possa reutilizar o seu saldo. Isso pode bloquear o seu saldo por vários minutos, enquanto a confirmação ocorre. Sem a divisão, você pode ter que esperar a confirmação da transação do ticket, o que pode levar várias horas. Ela pode ser deixada em 0.01. Isso não afeta as suas chances de comprar tickets ou votar com eles.

**Endereço de Votação** O endereço Decred que irá realizar a votação.

**Endereço da Taxa de Pool** O endereço para onde a taxa da stakepool será paga.

**Taxa de Pool (%)** A taxa que você será cobrado por usar os serviços da stakepool.
