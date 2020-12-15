# Gap Limit

**Warnung! Die Einstellung für das Gap-Limit sollte in der Regel nicht verändert werden.** Eine Erhöhung des Gap-Limits kann zu erheblichen Leistungseinbußen führen.

Gap-Limit legt die Anzahl der Adressen fest die die Wallet generiert und vorausschauend für die Nutzung berücksichtigt. Standardmäßig ist das Gap-Limit auf 20 eingestellt. Dies bedeutet zwei Dinge.

  1. Wenn die Wallet zum ersten Mal geladen wird scannt es nach den verwendeten Adressen und erwartet, dass die Lücke zwischen den Adressen nicht größer als 20 ist;

  2. Wenn der Benutzer neue Adressen generiert werden nur 20 Adressen ausgegeben bevor der Zähler zurückgesetzt wird, wodurch sichergestellt wird, dass die Adresslücken nicht größer als 20 sind.

Es gibt eigentlich nur 2 Gründe warum Sie diesen Wert ändern sollten:

  1. Wenn Ihre Wallet vor v1.0 erstellt und intensiv genutzt wurde ist es möglich, dass es größere Adresslücken gibt.  Wenn Sie Ihr Wallet aus der Seed-Phrase wiederherstellen und feststellen, dass Ihnen Guthaben fehlt, können Sie das Gap Limit auf 100 erhöhen (dann 1000, wenn das Problem nicht behoben ist) und Decrediton neu starten. Sobald Ihr Guthaben bereinigt ist können Sie das Gap Limit wieder auf 20 zurücksetzen.

  2. Wenn Sie in der Lage sein möchten mehr als 20 Adressen auf einmal zu generieren ohne dass es zu einem Rundlauf der Adressen kommt.
