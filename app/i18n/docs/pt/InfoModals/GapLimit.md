# Informações sobre o Limite de Intervalo

*Atenção* Esse limite de intervalo normalmente não deve ser alterado. Aumentar esse limite pode causar grande perda de desempenho.",

O limite de intervalo (gap limit) indica a quantidade de endereços que a carteira irá gerar e observar para determinar seu uso. O padrão desse limite é 20. Isso significa duas coisas:

  1. Quando a carteira é carregada pela primeira vez, ela procura por endereços utilizados e espera que o maior intervalo entre endereços usados seja 20.

  2. Ao fornecer um endereço gerado ao usuário, a carteira irá exibir apenas 20 endereços e então voltará ao primeiro, o que garante que o limite nunca ultrapasse os 20.

Só existem duas razões para você querer mudar esse valor:

  1. Se a sua carteira foi criada e muito utilizada antes da versão 1.0 do software, ela pode ter intervalos grandes de endereços. Se você restaurar a partir da seed e notar que estão faltando fundos, você pode aumentar esse limite para 100 (ou para 1000 se isso não for suficiente) e então reiniciar o Decrediton. Após o seu saldo ficar correto, você pode reverter esse intervalo para 20.

  2. Se você quiser gerar mais de 20 endereços de uma só vez sem repetição.
