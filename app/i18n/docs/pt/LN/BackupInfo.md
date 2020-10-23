# Info Sobre Backup de Carteiras LN

Devido a sua natureza como rede de secunda camada, dados relacionados a sua carteira LN **não** são armazenados na blockchain. Isso significa que a seed da carteira **não é suficiente** para restaurar o saldo LN de uma carteira em caso de recuerapação de seed.

Usuários da LN **também** precisam regularmente armazenar o _arquivo SCB_ para que uma carteira recuperada possa ser usada para fechar canais abertos pela carteira anterior.

O backup deve ser atualizado toda vez que um canal é aberto ou fechado no nó LN local (incluindo quando o nó _remoto_ abre um canal de volta para o nó local).

Para mais informações sobre backups da LN, por favor veja a documentação em https://docs.decred.org/lightning-network/backups/
