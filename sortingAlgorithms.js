// sortingAlgorithms.js

async function* mergeSort(arr) {
  async function* merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;

    const L = arr.slice(l, m + 1);
    const R = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
      yield { action: 'compare', indices: [l + i, m + 1 + j] };
      await new Promise(res => setTimeout(res, 50));

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        yield { action: 'overwrite', index: k, value: L[i] };
        i++;
      } else {
        arr[k] = R[j];
        yield { action: 'overwrite', index: k, value: R[j] };
        j++;
      }
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      yield { action: 'overwrite', index: k, value: L[i] };
      i++; k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      yield { action: 'overwrite', index: k, value: R[j] };
      j++; k++;
    }
  }

  async function* mergeSortRecursive(arr, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);

    yield* mergeSortRecursive(arr, l, m);
    yield* mergeSortRecursive(arr, m + 1, r);
    yield* merge(arr, l, m, r);
  }

  yield* mergeSortRecursive(arr, 0, arr.length - 1);
}
