let arr = [];
let narrationSteps = [];
let isPaused = false;
let currentStep = 0;
let intervalId = null;
let synth = window.speechSynthesis;
let barCount = 60;

function createBars() {
  const barsContainer = document.getElementById("bars");
  barsContainer.innerHTML = "";
  arr = [];
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    const value = Math.floor(Math.random() * 100) + 1;
    bar.style.height = `${value * 3}px`;
    bar.className = "bar";
    barsContainer.appendChild(bar);
    arr.push(value);
  }
}

function speak(text) {
  if (!text || isPaused) return;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSortWithNarration() {
  const bars = document.getElementsByClassName("bar");
  let speed = document.getElementById("speedRange").value;
  narrationSteps = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (isPaused) {
        await waitUntilResume();
      }

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        narrationSteps.push(`Swapped index ${j} (${arr[j + 1]}) and ${j + 1} (${arr[j]})`);
        speak(narrationSteps[narrationSteps.length - 1]);

        bars[j].style.height = `${arr[j] * 3}px`;
        bars[j + 1].style.height = `${arr[j + 1] * 3}px`;

        await sleep(speed);
      }
    }
  }
}

function waitUntilResume() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (!isPaused) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

function startSort() {
  isPaused = false;
  synth.cancel(); // Stop any previous narration
  bubbleSortWithNarration();
}

function pauseSort() {
  isPaused = true;
  synth.pause();
}

function resetBars() {
  isPaused = true;
  synth.cancel();
  createBars();
}

function exportNarration() {
  if (narrationSteps.length === 0) {
    alert("No steps to export yet.");
    return;
  }

  const blob = new Blob([narrationSteps.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "narration.txt";
  link.click();
}

document.getElementById("speedRange").addEventListener("input", function () {
  // Speed change only takes effect on next animation step
});

window.onload = createBars;
