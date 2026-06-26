const categorySelect = document.querySelector("#categorySelect");
const algorithmSelect = document.querySelector("#algorithmSelect");
const targetInput = document.querySelector("#targetInput");
const arraySizeRange = document.querySelector("#arraySizeRange");
const speedRange = document.querySelector("#speedRange");
const selectedValue = document.querySelector("#selectedValue");
const speedValue = document.querySelector("#speedValue");
const runButton = document.querySelector("#runButton");
const generateArrayButton = document.querySelector("#generateArrayButton");
const resetButton = document.querySelector("#resetButton");
const modeValue = document.querySelector("#modeValue");
const arraySizeValue = document.querySelector("#arraySizeValue");
const arrayContainer = document.querySelector("#arrayContainer");
const arrayStatusMessage = document.querySelector("#arrayStatusMessage");
const arrayValuesPanel = document.querySelector("#arrayValuesPanel");
const algorithmNameValue = document.querySelector("#algorithmNameValue");
const comparisonsValue = document.querySelector("#comparisonsValue");
const swapsValue = document.querySelector("#swapsValue");
const timeComplexityValue = document.querySelector("#timeComplexityValue");
const spaceComplexityValue = document.querySelector("#spaceComplexityValue");
const controls = document.querySelectorAll("button, select, input");

let values = [];
let arraySize = Number(arraySizeRange.value);
let animationSpeed = Number(speedRange.value);
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let currentMaxValue = 400;

const algorithmStats = {
  bubbleSort: {
    name: "Bubble Sort",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)"
  },
  selectionSort: {
    name: "Selection Sort",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)"
  },
  insertionSort: {
    name: "Insertion Sort",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)"
  },
  mergeSort: {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)"
  },
  quickSort: {
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)"
  },
  binarySearch: {
    name: "Binary Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)"
  }
};

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateStatus() {
  arraySize = Number(arraySizeRange.value);
  animationSpeed = Number(speedRange.value);

  selectedValue.textContent = categorySelect.value;
  speedValue.textContent = `${animationSpeed}ms`;
  arraySizeValue.textContent = arraySize;
  updateStats();
}

function updateStats() {
  const selectedAlgorithm = algorithmStats[algorithmSelect.value];

  algorithmNameValue.textContent = selectedAlgorithm.name;
  comparisonsValue.textContent = comparisons;
  swapsValue.textContent = swaps;
  timeComplexityValue.textContent = selectedAlgorithm.timeComplexity;
  spaceComplexityValue.textContent = selectedAlgorithm.spaceComplexity;
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  updateStats();
}

function clearBars() {
  arrayContainer.innerHTML = "";
  arrayContainer.classList.remove("has-bars");
  arrayStatusMessage.textContent = "";
  arrayStatusMessage.classList.remove("has-message");
  arrayValuesPanel.textContent = "";
  arrayValuesPanel.classList.remove("has-values");
}

function getBars() {
  return Array.from(document.querySelectorAll(".array-bar"));
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function setControlsDisabled(disabled) {
  controls.forEach((control) => {
    control.disabled = disabled;
  });
}

function setBarHeight(bar, value) {
  const maxValue = currentMaxValue || value || 1;
  const heightPercent = (value / maxValue) * 90;

  console.log({
    value,
    maxValue,
    heightPercent
  });

  bar.style.height = `${heightPercent}%`;
  bar.title = String(value);
  bar.dataset.value = String(value);

  const valueLabel = bar.parentElement.querySelector(".bar-value");
  if (valueLabel) {
    valueLabel.textContent = value;
  }
}

function clearBarStates(...bars) {
  bars.forEach((bar) => {
    bar.classList.remove(
      "comparing",
      "swapped",
      "current",
      "minimum",
      "shifting",
      "inserting",
      "dividing",
      "merging",
      "pivot",
      "partitioning",
      "search-window",
      "left",
      "middle",
      "right",
      "eliminated",
      "found"
    );
  });
}

function prepareBarsForSort(bars) {
  bars.forEach((bar) => {
    clearBarStates(bar);
    bar.classList.remove("sorted");
  });
}

function renderArray() {
  clearBars();
  currentMaxValue = Math.max(...values);
  const shouldShowValues = values.length <= 25;
  const shouldShowAllIndexes = values.length <= 20;
  const barWidth = Math.max(6, Math.min(34, Math.floor(760 / values.length)));

  arrayContainer.style.setProperty("--bar-width", `${barWidth}px`);

  values.forEach((value, index) => {
    const barGroup = document.createElement("div");
    const valueLabel = document.createElement("span");
    const bar = document.createElement("div");
    const indexLabel = document.createElement("span");

    barGroup.className = "bar-group";
    valueLabel.className = "bar-value";
    bar.className = "array-bar";
    indexLabel.className = "bar-index";
    barGroup.title = `Index: ${index}\nValue: ${value}`;
    indexLabel.textContent = index;

    if (!shouldShowValues) {
      valueLabel.classList.add("is-hover-only");
    }

    if (!shouldShowAllIndexes && index % 5 !== 0) {
      indexLabel.classList.add("is-hidden");
    }

    barGroup.appendChild(valueLabel);
    barGroup.appendChild(bar);
    barGroup.appendChild(indexLabel);
    setBarHeight(bar, value);
    arrayContainer.appendChild(barGroup);
  });

  arrayStatusMessage.textContent = `Generated array with ${values.length} elements`;
  arrayStatusMessage.classList.add("has-message");
  arrayValuesPanel.textContent = values.join(", ");
  arrayValuesPanel.classList.add("has-values");
  arrayContainer.classList.add("has-bars");
  updateStatus();
}

function generateArray() {
  if (isSorting) {
    return;
  }

  arraySize = Number(arraySizeRange.value);
  values = Array.from({ length: arraySize }, () => getRandomValue(20, 400));
  modeValue.textContent = "Array generated";
  resetStats();
  renderArray();
}

async function bubbleSort() {
  if (values.length === 0) {
    generateArray();
  }

  isSorting = true;
  setControlsDisabled(true);
  modeValue.textContent = "Sorting";

  try {
    const bars = getBars();
    resetStats();
    prepareBarsForSort(bars);

    for (let i = 0; i < values.length - 1; i += 1) {
      for (let j = 0; j < values.length - i - 1; j += 1) {
        const firstBar = bars[j];
        const secondBar = bars[j + 1];

        firstBar.classList.add("comparing");
        secondBar.classList.add("comparing");
        comparisons += 1;
        updateStats();
        await sleep(animationSpeed);

        if (values[j] > values[j + 1]) {
          [values[j], values[j + 1]] = [values[j + 1], values[j]];
          swaps += 1;
          updateStats();

          firstBar.classList.remove("comparing");
          secondBar.classList.remove("comparing");
          firstBar.classList.add("swapped");
          secondBar.classList.add("swapped");

          setBarHeight(firstBar, values[j]);
          setBarHeight(secondBar, values[j + 1]);
          await sleep(animationSpeed);
        }

        clearBarStates(firstBar, secondBar);
      }

      bars[values.length - i - 1].classList.add("sorted");
    }

    if (bars.length > 0) {
      bars[0].classList.add("sorted");
    }

    modeValue.textContent = "Sorted";
  } finally {
    setControlsDisabled(false);
    isSorting = false;
  }
}

async function selectionSort() {
  if (values.length === 0) {
    generateArray();
  }

  isSorting = true;
  setControlsDisabled(true);
  modeValue.textContent = "Sorting";

  try {
    const bars = getBars();
    resetStats();
    prepareBarsForSort(bars);

    for (let i = 0; i < values.length; i += 1) {
      let minIndex = i;
      bars[i].classList.add("current", "minimum");
      await sleep(animationSpeed);

      for (let j = i + 1; j < values.length; j += 1) {
        bars[j].classList.add("comparing");
        comparisons += 1;
        updateStats();
        await sleep(animationSpeed);

        if (values[j] < values[minIndex]) {
          bars[minIndex].classList.remove("minimum");
          minIndex = j;
          bars[minIndex].classList.add("minimum");
          await sleep(animationSpeed);
        }

        if (j !== minIndex) {
          bars[j].classList.remove("comparing");
        }
      }

      if (minIndex !== i) {
        [values[i], values[minIndex]] = [values[minIndex], values[i]];
        swaps += 1;
        updateStats();

        bars[i].classList.remove("current", "minimum", "comparing");
        bars[minIndex].classList.remove("minimum", "comparing");
        bars[i].classList.add("swapped");
        bars[minIndex].classList.add("swapped");

        setBarHeight(bars[i], values[i]);
        setBarHeight(bars[minIndex], values[minIndex]);
        await sleep(animationSpeed);
      }

      clearBarStates(bars[i], bars[minIndex]);
      bars[i].classList.add("sorted");
    }

    modeValue.textContent = "Sorted";
  } finally {
    setControlsDisabled(false);
    isSorting = false;
  }
}

async function insertionSort() {
  if (values.length === 0) {
    generateArray();
  }

  isSorting = true;
  setControlsDisabled(true);
  modeValue.textContent = "Sorting";

  try {
    const bars = getBars();
    resetStats();
    prepareBarsForSort(bars);

    if (bars.length > 0) {
      bars[0].classList.add("sorted");
    }

    for (let i = 1; i < values.length; i += 1) {
      const key = values[i];
      let j = i - 1;

      bars[i].classList.remove("sorted");
      bars[i].classList.add("current", "inserting");
      await sleep(animationSpeed);

      while (j >= 0) {
        bars[j].classList.add("comparing");
        comparisons += 1;
        updateStats();
        await sleep(animationSpeed);

        if (values[j] <= key) {
          bars[j].classList.remove("comparing");
          break;
        }

        values[j + 1] = values[j];
        swaps += 1;
        updateStats();

        bars[j].classList.remove("comparing");
        bars[j].classList.add("shifting");
        bars[j + 1].classList.add("shifting");
        setBarHeight(bars[j + 1], values[j + 1]);
        await sleep(animationSpeed);

        clearBarStates(bars[j], bars[j + 1]);
        j -= 1;
      }

      values[j + 1] = key;
      bars[j + 1].classList.add("inserting");
      setBarHeight(bars[j + 1], key);
      await sleep(animationSpeed);

      for (let sortedIndex = 0; sortedIndex <= i; sortedIndex += 1) {
        clearBarStates(bars[sortedIndex]);
        bars[sortedIndex].classList.add("sorted");
      }
    }

    bars.forEach((bar) => {
      clearBarStates(bar);
      bar.classList.add("sorted");
    });
    modeValue.textContent = "Sorted";
  } finally {
    setControlsDisabled(false);
    isSorting = false;
  }
}

function markRange(bars, start, end, className) {
  for (let index = start; index <= end; index += 1) {
    bars[index].classList.add(className);
  }
}

function clearRangeState(bars, start, end, className) {
  for (let index = start; index <= end; index += 1) {
    bars[index].classList.remove(className);
  }
}

async function merge(bars, start, middle, end) {
  const leftValues = values.slice(start, middle + 1);
  const rightValues = values.slice(middle + 1, end + 1);
  let leftIndex = 0;
  let rightIndex = 0;
  let targetIndex = start;

  markRange(bars, start, end, "merging");
  await sleep(animationSpeed);

  while (leftIndex < leftValues.length && rightIndex < rightValues.length) {
    const leftBarIndex = start + leftIndex;
    const rightBarIndex = middle + 1 + rightIndex;

    bars[leftBarIndex].classList.add("comparing");
    bars[rightBarIndex].classList.add("comparing");
    comparisons += 1;
    updateStats();
    await sleep(animationSpeed);

    if (leftValues[leftIndex] <= rightValues[rightIndex]) {
      values[targetIndex] = leftValues[leftIndex];
      leftIndex += 1;
    } else {
      values[targetIndex] = rightValues[rightIndex];
      rightIndex += 1;
    }

    swaps += 1;
    updateStats();
    bars[targetIndex].classList.add("inserting");
    setBarHeight(bars[targetIndex], values[targetIndex]);
    await sleep(animationSpeed);

    clearBarStates(bars[leftBarIndex], bars[rightBarIndex], bars[targetIndex]);
    bars[targetIndex].classList.add("merging");
    targetIndex += 1;
  }

  while (leftIndex < leftValues.length) {
    values[targetIndex] = leftValues[leftIndex];
    swaps += 1;
    updateStats();

    bars[targetIndex].classList.add("inserting");
    setBarHeight(bars[targetIndex], values[targetIndex]);
    await sleep(animationSpeed);

    clearBarStates(bars[targetIndex]);
    bars[targetIndex].classList.add("merging");
    leftIndex += 1;
    targetIndex += 1;
  }

  while (rightIndex < rightValues.length) {
    values[targetIndex] = rightValues[rightIndex];
    swaps += 1;
    updateStats();

    bars[targetIndex].classList.add("inserting");
    setBarHeight(bars[targetIndex], values[targetIndex]);
    await sleep(animationSpeed);

    clearBarStates(bars[targetIndex]);
    bars[targetIndex].classList.add("merging");
    rightIndex += 1;
    targetIndex += 1;
  }

  clearRangeState(bars, start, end, "merging");
}

async function mergeSortRange(bars, start, end) {
  if (start >= end) {
    bars[start].classList.add("dividing");
    await sleep(Math.max(10, animationSpeed / 2));
    bars[start].classList.remove("dividing");
    return;
  }

  const middle = Math.floor((start + end) / 2);
  markRange(bars, start, end, "dividing");
  await sleep(animationSpeed);
  clearRangeState(bars, start, end, "dividing");

  await mergeSortRange(bars, start, middle);
  await mergeSortRange(bars, middle + 1, end);
  await merge(bars, start, middle, end);
}

async function mergeSort() {
  if (values.length === 0) {
    generateArray();
  }

  isSorting = true;
  setControlsDisabled(true);
  modeValue.textContent = "Sorting";

  try {
    const bars = getBars();
    resetStats();
    prepareBarsForSort(bars);

    await mergeSortRange(bars, 0, values.length - 1);

    bars.forEach((bar) => {
      clearBarStates(bar);
      bar.classList.add("sorted");
    });
    modeValue.textContent = "Sorted";
  } finally {
    setControlsDisabled(false);
    isSorting = false;
  }
}

function swapValuesAndBars(bars, firstIndex, secondIndex) {
  [values[firstIndex], values[secondIndex]] = [values[secondIndex], values[firstIndex]];
  setBarHeight(bars[firstIndex], values[firstIndex]);
  setBarHeight(bars[secondIndex], values[secondIndex]);
}

async function partition(bars, low, high) {
  const pivotValue = values[high];
  let smallerIndex = low - 1;

  markRange(bars, low, high, "partitioning");
  bars[high].classList.remove("partitioning");
  bars[high].classList.add("pivot");
  await sleep(animationSpeed);

  for (let currentIndex = low; currentIndex < high; currentIndex += 1) {
    bars[currentIndex].classList.add("comparing");
    comparisons += 1;
    updateStats();
    await sleep(animationSpeed);

    if (values[currentIndex] < pivotValue) {
      smallerIndex += 1;

      if (smallerIndex !== currentIndex) {
        bars[smallerIndex].classList.add("swapped");
        bars[currentIndex].classList.add("swapped");
        swapValuesAndBars(bars, smallerIndex, currentIndex);
        swaps += 1;
        updateStats();
        await sleep(animationSpeed);
        clearBarStates(bars[smallerIndex], bars[currentIndex]);
      }
    }

    bars[currentIndex].classList.remove("comparing");
    if (currentIndex !== high) {
      bars[currentIndex].classList.add("partitioning");
    }
  }

  const pivotIndex = smallerIndex + 1;

  if (pivotIndex !== high) {
    bars[pivotIndex].classList.add("swapped");
    bars[high].classList.add("swapped");
    swapValuesAndBars(bars, pivotIndex, high);
    swaps += 1;
    updateStats();
    await sleep(animationSpeed);
  }

  clearRangeState(bars, low, high, "partitioning");
  clearBarStates(bars[pivotIndex], bars[high]);
  bars[pivotIndex].classList.add("sorted");

  return pivotIndex;
}

async function quickSortRange(bars, low, high) {
  if (low > high) {
    return;
  }

  if (low === high) {
    bars[low].classList.add("sorted");
    await sleep(Math.max(10, animationSpeed / 2));
    return;
  }

  const pivotIndex = await partition(bars, low, high);
  await quickSortRange(bars, low, pivotIndex - 1);
  await quickSortRange(bars, pivotIndex + 1, high);
}

async function quickSort() {
  if (values.length === 0) {
    generateArray();
  }

  isSorting = true;
  setControlsDisabled(true);
  modeValue.textContent = "Sorting";

  try {
    const bars = getBars();
    resetStats();
    prepareBarsForSort(bars);

    await quickSortRange(bars, 0, values.length - 1);

    bars.forEach((bar) => {
      clearBarStates(bar);
      bar.classList.add("sorted");
    });
    modeValue.textContent = "Sorted";
  } finally {
    setControlsDisabled(false);
    isSorting = false;
  }
}

function sortArrayForSearch() {
  values.sort((first, second) => first - second);
  renderArray();
}

function updateSearchWindow(bars, leftIndex, rightIndex, middleIndex) {
  bars.forEach((bar, index) => {
    clearBarStates(bar);

    if (index < leftIndex || index > rightIndex) {
      bar.classList.add("eliminated");
      return;
    }

    bar.classList.add("search-window");
  });

  if (bars[leftIndex]) {
    bars[leftIndex].classList.add("left");
  }

  if (bars[middleIndex]) {
    bars[middleIndex].classList.add("middle");
  }

  if (bars[rightIndex]) {
    bars[rightIndex].classList.add("right");
  }
}

async function binarySearch() {
  if (values.length === 0) {
    generateArray();
  }

  const target = Number(targetInput.value);

  isSorting = true;
  setControlsDisabled(true);
  modeValue.textContent = "Preparing search";

  try {
    sortArrayForSearch();
    const bars = getBars();
    resetStats();
    prepareBarsForSort(bars);
    await sleep(animationSpeed);

    let leftIndex = 0;
    let rightIndex = values.length - 1;
    let foundIndex = -1;

    modeValue.textContent = `Searching for ${target}`;

    while (leftIndex <= rightIndex) {
      const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
      updateSearchWindow(bars, leftIndex, rightIndex, middleIndex);
      comparisons += 1;
      updateStats();
      await sleep(animationSpeed);

      if (values[middleIndex] === target) {
        foundIndex = middleIndex;
        bars[middleIndex].classList.remove("middle", "search-window");
        bars[middleIndex].classList.add("found");
        modeValue.textContent = "Target found";
        break;
      }

      if (values[middleIndex] < target) {
        for (let index = leftIndex; index <= middleIndex; index += 1) {
          clearBarStates(bars[index]);
          bars[index].classList.add("eliminated");
        }

        leftIndex = middleIndex + 1;
      } else {
        for (let index = middleIndex; index <= rightIndex; index += 1) {
          clearBarStates(bars[index]);
          bars[index].classList.add("eliminated");
        }

        rightIndex = middleIndex - 1;
      }

      await sleep(animationSpeed);
    }

    if (foundIndex === -1) {
      bars.forEach((bar) => {
        clearBarStates(bar);
        bar.classList.add("eliminated");
      });
      modeValue.textContent = "Target not found";
    }
  } finally {
    setControlsDisabled(false);
    isSorting = false;
  }
}

categorySelect.addEventListener("change", updateStatus);
algorithmSelect.addEventListener("change", () => {
  resetStats();
  updateStatus();
});
speedRange.addEventListener("input", updateStatus);
arraySizeRange.addEventListener("input", generateArray);
generateArrayButton.addEventListener("click", generateArray);

runButton.addEventListener("click", async () => {
  if (isSorting) {
    return;
  }

  if (algorithmSelect.value === "bubbleSort") {
    await bubbleSort();
  }

  if (algorithmSelect.value === "selectionSort") {
    await selectionSort();
  }

  if (algorithmSelect.value === "insertionSort") {
    await insertionSort();
  }

  if (algorithmSelect.value === "mergeSort") {
    await mergeSort();
  }

  if (algorithmSelect.value === "quickSort") {
    await quickSort();
  }

  if (algorithmSelect.value === "binarySearch") {
    await binarySearch();
  }
});

resetButton.addEventListener("click", () => {
  categorySelect.value = "Arrays";
  arraySizeRange.value = "50";
  speedRange.value = "100";
  values = [];
  clearBars();
  resetStats();
  modeValue.textContent = "UI scaffold";
  updateStatus();
});

updateStatus();
