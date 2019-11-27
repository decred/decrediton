# Límite de Brecha

**¡Advertencia! Esta configuración de límite de espacio generalmente se debe dejar por defecto.**  Un aumento al límite de brecha podría causar una degradación importante del rendimiento.

El límite de espacio establece la cantidad de direcciones que generará la cartera y mira hacia adelante para determinar el uso. Por defecto, el límite de espacio se establece en 20. Esto significa 2 cosas.

  1. Cuando la cartera se carga por primera vez, analiza el uso de la dirección y espera que la brecha más grande entre las direcciones sea 20;

  2. Al proporcionar al usuario direcciones recién generadas, solo dará 20 direcciones y luego volverá en bucle, lo que garantiza que las brechas no sean mayores de 20.

En realidad, solo hay 2 razones por las que debería cambiar este valor:

  1. Si su cartera fue creada y utilizada en gran medida antes de aproximadamente v1.0, puede tener grandes brechas de direcciones. Si restaura a partir de la semilla y nota que le faltan fondos, puede aumentar esto a 100 (luego 1000 si no está arreglado) y luego reiniciar el decrediton. Una vez que se resuelva su saldo, puede volver a 20.

  2. Si desea poder generar más de 20 direcciones a la vez sin tener que envolver.
