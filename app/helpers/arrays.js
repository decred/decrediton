export function equalElements(array1, array2) {
  return (array1.length === array2.length) &&
    (!array1.some(v => array2.indexOf(v) < 0));
}
