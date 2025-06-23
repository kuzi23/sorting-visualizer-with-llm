export function bubbleSort(array) {
  const steps = [];
  const arr = [...array];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        steps.push({ type: "swap", indices: [j, j + 1], values: [arr[j], arr[j + 1]] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return steps;
}

export function insertionSort(array) {
  const steps = [];
  const arr = [...array];
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({ type: "move", from: j, to: j + 1, value: arr[j] });
      arr[j + 1] = arr[j];
      j--;
    }
    steps.push({ type: "insert", index: j + 1, value: key });
    arr[j + 1] = key;
  }
  return steps;
}
