# Informação sobre Compra Automática

**Saldo a ser Mantido** Se o seu saldo é menor do que esse número, você não comprará mais tickets. O valor de 0 significa que todos os fundos da sua conta irão para a compra de tickets.

**Taxa Máxima** Tickets entram na mempool na ordem de sua taxa por kilobyte. Esse parâmetro estabelece a taxa máxima que você está disposto a pagar.

**Preço Máximo Absoluto** Se o preço do ticket estiver acima desse valor, você não poderá comprar mais tickets. O valor padrão 0 desliga isso.

**Preço Máximo Relativo** Esse número estabelece o preço máximo para comprar tickets baseado na observação do preço médio multiplicado por esse número. Ex: se o preço médio é 100 e esse número é 1.25, então o preço máximo para comprar tickets seria 125 DCR.

**Máx. por Bloco** Não comprar mais do que esse número de tickets por bloco. Um número negativo significa que comprar um ticket a cada n blocos. Ex: -2 significaria comprar um ticket bloco sim, bloco não.
