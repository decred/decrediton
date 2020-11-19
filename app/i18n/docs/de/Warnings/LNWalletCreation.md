# Bevor Sie fortfahren...

Bitte sind Sie sich darüber bewusst, dass [Lightning Network] (https://docs.decred.org/lightning-network/overview/)
ist noch in Arbeit und sollte mit Vorsicht verwendet werden. Insbesondere:

- Verstehen Sie, dass [Sicherungsdaten] (https://docs.decred.org/lightning-network/backups/) _zusätzlich zu Ihrem Wallet Seed_ benötigt werden, um über Ihre LN-Gelder zu Verfügen.

- LN wurde unter der Annahme implementiert, dass die Knoten (Wallets) die meiste Zeit online sind, so dass _episodische_ Wallets (solche, die nur für eine sehr geringe Zeitspanne online bleiben) eine verminderte Fähigkeit zum Senden und Empfangen von Zahlungen aufweisen können.

- Verstehen Sie, dass eine böswillige Gegenpartei Gelder aus _episodischen_ Wallets stehlen kann, es sei denn, sie benutzt einen [Wachturm] (https://docs.decred.org/lightning-network/watchtowers/) Service.

- Sie können nur Zahlungen bis zu dem Betrag senden und empfangen, der in Ihren veröffentlichten Kanälen verfügbar ist, wofür in der Regel bis zu 6 Bestätigungen (Blöcke) benötigt werden.

- Der Wallet-Account, welcher für LN-Operationen verwendet wird, bleibt _entsperrt_ während die LN-Wallet läuft, so dass Gelder von diesem Account durch jeden mit Fern- oder physischem Zugriff auf Ihren Computer gefährdet sind. Es wird empfohlen, einen separaten Account (oder besser noch ein separates _Wallet_) mit einem kleinen Geldbetrag zu verwenden, um das Risiko zu minimieren.
