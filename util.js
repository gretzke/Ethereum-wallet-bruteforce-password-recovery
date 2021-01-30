function binomial(n, k) {
  let coeff = 1;
  for (let x = n - k + 1; x <= n; x++) coeff *= x;
  for (let x = 1; x <= k; x++) coeff /= x;
  return coeff;
}

function factorial(n) {
  let j = 1;
  for (let i = 1; i <= n; i++) {
    j = j * i;
  }
  return j;
}

function getNumberOfCombinations(numItems) {
  let numCombinations = 0;

  for (let i = 1; i <= numItems; i++) {
    numCombinations += binomial(numItems, i) * factorial(i);
  }
  return numCombinations;
}

function permute(array) {
  Array.prototype.swap = function (index, otherIndex) {
    var valueAtIndex = this[index];

    this[index] = this[otherIndex];
    this[otherIndex] = valueAtIndex;
  };

  var result = [array.slice()],
    length = array.length;

  for (var i = 1, heap = new Array(length).fill(0); i < length; )
    if (heap[i] < i) {
      array.swap(i, i % 2 && heap[i]);
      result.push(array.slice());
      heap[i]++;
      i = 1;
    } else {
      heap[i] = 0;
      i++;
    }

  return result;
}

module.exports = {
  getNumberOfCombinations,
  permute,
};
