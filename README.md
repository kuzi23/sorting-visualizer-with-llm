# Sorting Visualizer with LLM

## 🧭 1. Project Overview

### 🎯 Objective
To develop an interactive, educational platform that visually simulates sorting algorithms and explains each step using natural language, adapting to the user’s understanding level with the help of a Large Language Model (LLM).

---

## 🔑 2. Key Features
- 📊 Visual Sorting Simulations
- 🧠 Step-by-Step Narration: Real-time explanations of what’s happening
- 🧩 Adaptive Explanations
- 🎮 Interactive Controls: Play, pause, reset, adjust speed, algorithm selection
- 🔈 Optional Voice Narration: Text-to-speech rendering of LLM-generated content
- 💻 Code View: Shows actual pseudocode/JS code alongside animation

---

## ⚙️ 3. Technical Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| Frontend      | React.js, HTML5 Canvas / SVG, Tailwind CSS   |
| State Mgmt    | Redux / Context API                          |
| Backend       | Node.js with Express.js (optional)           |
| Narration API | Python (Flask or FastAPI)                    |
| LLM Engine    | OpenAI GPT-4-turbo / Mistral 7B / Gemini     |
| Deployment    | Vercel (Frontend), Render / Railway (Backend)|
| Text-to-Speech| ElevenLabs / Google TTS / Azure TTS          |

---

## 🤖 4. Role of LLM in the Project

The LLM dynamically generates step-by-step explanations of sorting processes based on real-time algorithm state, user interaction, and selected difficulty level.

---

## 🏗️ 5. System Architecture Diagram (Text-based)
```
[ User ]
|
▼
[ Frontend - React UI ]
|
└── Sorting Visualizer (Canvas/SVG)
|
▼
[ Narration API - Python ]
|
▼
[ LLM Engine (GPT / Mistral) ]
|
└── (optional) TTS Engine (ElevenLabs, Google TTS)

```
