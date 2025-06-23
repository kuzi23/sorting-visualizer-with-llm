from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import uuid
import pyttsx3

app = FastAPI()

# Narration input model
class NarrationRequest(BaseModel):
    step: str
    algorithm: str
    difficulty: str

# Speak input model
class SpeakRequest(BaseModel):
    text: str

@app.post("/narrate")
def narrate(request: NarrationRequest):
    explanation = f"Explaining the step: {request.step} for {request.algorithm} at {request.difficulty} level."
    return {"explanation": explanation}

@app.post("/speak")
def speak_text(request: SpeakRequest):
    engine = pyttsx3.init()
    filename = f"audio_{uuid.uuid4()}.mp3"
    filepath = os.path.join("audio", filename)

    # Create audio folder if missing
    os.makedirs("audio", exist_ok=True)

    engine.save_to_file(request.text, filepath)
    engine.runAndWait()

    return FileResponse(filepath, media_type="audio/mpeg", filename=filename)
