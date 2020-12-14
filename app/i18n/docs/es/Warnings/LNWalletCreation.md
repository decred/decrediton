# Antes de continuar...

Por favor entienda que la [Lightning Network](https://docs.decred.org/lightning-network/overview/)
todavía está en progreso y debe usarse con cuidado. En particular:

- Entienda que la [copia de seguridad](https://docs.decred.org/lightning-network/backups/) se requiere _aparte de la semilla de su cartera_ para recuperar todo su saldo en LN.

- LN fue implementada asumiendo que los nodos (carteras) están conectadas la mayor parte del tiempo, así que carteras _episódicas_ (que se mantienen online durante poco tiempo) pueden ver degradada su habilidad para enviar y recibir pagos.

- Entienda que una contraparte maliciosa puede robar fondos de carteras _episódicas_ a menos que usen un servicio de [Torre de Vigilacia](https://docs.decred.org/lightning-network/watchtowers/).

- Solo puede enviar y recibir pagos hasta la cantidad disponible en sus canales publicados, que usualmente requiere hasta 6 confirmaciones (bloques) para estar disponible.

- La cartera usada para las operaciones en LN se mantiene _desbloqueada_ mientras la cartera LN está corriendo. Los fondos de esa cuenta están en riesgo de cualquiera que tenga acceso remoto o físico al dispositivo. Se recomienda usar una cuenta separada (o mejor aún, una _cartera_ separada) con cantidades pequeñas de saldo para minimizar el riesgo.
