## Advertencia

Forzar el cierre de un canal desconectado es un cierre _no cooperativo_. Esto significa que los fondos pueden quedar bloqueados temporalmente por la transacción de compromiso y por cualquier HTLC (abierto) que haya quedado hasta que el componente de limpieza detecte que esos fondos pueden ser reclamados.

