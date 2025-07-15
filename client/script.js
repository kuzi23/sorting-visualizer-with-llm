let arr = [];
let narrationSteps = [];
let isPaused = false;
let isSorting = false;
let synth = window.speechSynthesis;
let barCount = 60;
let delay = 300;

function createBars() {
  const barsContainer = document.getElementById("bars");
  barsContainer.innerHTML = "";
  arr = [];
  for (let i = 0; i < barCount; i++) {
    const value = Math.floor(Math.random() * 100) + 1;
    const bar = document.createElement("div");
    bar.style.height = `${value * 3}px`;
    bar.className = "bar";
    bar.title = value;
    barsContainer.appendChild(bar);
    arr.push(value);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function speak(text) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById("lang").value || "en";
  synth.speak(utterance);
}

async function bubbleSortWithNarration() {
  const speedSlider = document.getElementById("speedRange");
  const bars = document.getElementsByClassName("bar");
  narrationSteps = [];
  isSorting = true;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      while (isPaused) await waitUntilResume();
      delay = parseInt(speedSlider.value);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        updateBars();

        const narration = `Swapped index ${j} (${arr[j + 1]}) and ${j + 1} (${arr[j]})`;
        narrationSteps.push(narration);
        speak(narration);
        document.getElementById("narrationBox").innerText = narration;

        await sleep(delay);
      }
    }
  }

  isSorting = false;
}

function updateBars() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < arr.length; i++) {
    bars[i].style.height = `${arr[i] * 3}px`;
    bars[i].title = arr[i];
  }
}

function startSort() {
  if (isSorting) return;
  isPaused = false;
  synth.cancel();
  bubbleSortWithNarration();
}

function pauseSort() {
  isPaused = true;
  synth.pause();
}

function resetBars() {
  isPaused = true;
  isSorting = false;
  synth.cancel();
  createBars();
  document.getElementById("narrationBox").innerText = "";
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

function getNarration() {
  const step = document.getElementById("stepInput").value;
  const lang = document.getElementById("lang").value;

  fetch("http://127.0.0.1:5000/narrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ algorithm_state: step, lang: lang })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("narrationBox").innerText = data.narration || "No narration received.";
      speak(data.narration);
    })
    .catch(err => {
      console.error("❌ Failed to fetch narration", err);
      document.getElementById("narrationBox").innerText = "❌ Failed to fetch narration.";
    });
}

// Handle speed slider changes
document.getElementById("speedRange").addEventListener("input", function () {
  delay = parseInt(this.value);
});

// Create bars initially
window.onload = createBars;
