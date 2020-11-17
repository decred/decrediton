# LN Wallet Backup Informationen

Aufgrund ihrer Beschaffenheit als zweite Netzwerkschicht werden LN-bezogene Walletdaten **nicht** in der Blockchain selbst gespeichert. Das bedeutet, dass der standard Seed**nicht ausreicht**, um das LN-Guthaben einer Wallet mit dem Seed allein wiederherzustellen. 

LN-Benutzer müssen **auch** regelmäßig die _SCB-Datei_ speichern und sicher verwahren, damit
ein wiederhergestelltes Lightning Wallet dazu verwendet werden kann die Kanäle zu schließen, welche von dem
vorherigen Lightning Wallet geöffnet wurden.

Die Sicherung sollte jedes Mal aktualisiert werden, wenn ein Kanal auf der
lokalen LN-Node geöffnet oder geschlossen wird (einschließlich Kanäle die durch _remote_-Nodes zur lokalen LN-Node geöffnet wurden).

Weitere Informationen zu LN-Backups finden Sie in der Dokumentation unter
https://docs.decred.org/lightning-network/backups/
