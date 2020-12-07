# Copia de Seguridad de la Cartera LN

Debido a que se trata de una red de segunda capa, todos los datos relacionados a la cartera LN **no** se guardan en la blockchain. Esto significa que la semilla **no alcanza** para recuperar el saldo de una cartera LN.

Los usuarios de LN **también** necesitan guardar su _archivo SCB_ de forma segura y con regularidad para que una cartera LN recuperada pueda usarse para cerrar los canales abiertos por la cartera anterior.

La copia de seguridad se debe actualizar cada vez que un canal se abre o se cierra en el nodo local de LN (incluyendo cuando un nodo _remoto_ abre un canal hacia el nodo local).

Para más información sobre las copias de seguridad de LN, por favor consulte la documentación en
https://docs.decred.org/lightning-network/backups/
