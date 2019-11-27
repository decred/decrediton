# Información Sobre La Compra Automática

**Saldo a mantener** Si su saldo es inferior a este número, no comprará tickets. El valor predeterminado de 0 usará todos los fondos en su cuenta para comprar tickets.

**Tarifa máxima** Los tickets de tarifa máxima se ingresan en el mempool en orden de tarifa por kilobyte. Esto establece la tarifa máxima que está dispuesto a pagar.

**Precio máximo absoluto** Si el precio del ticket está por encima de este valor, no comprará más tickets. El valor predeterminado de 0 desactiva esto.

**Precio máximo relativo** Este número establece el precio máximo para comprar tickets en función del precio promedio observado multiplicado por este número. p.ej. Si el precio promedio es 100, y se estableció en 1.25, entonces el precio máximo para comprar boletos sería 125 DCR.

**Máximo por bloque** No compre más de este número de tickets por bloque. Un número negativo significa comprar un ticket cada n bloques. p.ej. -2 significaría comprar un ticket cada segundo bloque.
