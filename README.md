# 🧘 AI Mental Health Chatbot

> A supportive mental-health companion chatbot — a **Flask** NLP backend that classifies user intent
> and responds with empathetic messages, paired with a **three.js** 3D-avatar web frontend and an
> optional voice (speech-to-text / text-to-speech) module.

<p align="left">
  <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" />
  <img alt="Flask" src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white" />
  <img alt="three.js" src="https://img.shields.io/badge/three.js-000000?logo=three.js&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" />
</p>

> 🎓 **Portfolio note:** A compact end-to-end project — a clean intent-classification NLP engine, a REST
> API, a 3D-rendered frontend, and an optional offline voice interface. Responses are intentionally
> rule-based and transparent (no black-box model), which suits a wellbeing assistant where predictable,
> safe replies matter.

---

## 🏗️ How it works

```
Browser (index.html + three.js avatar)
        │  POST /chat  { "message": "I feel anxious" }
        ▼
Flask API (app.py)
        │  get_response(text)
        ▼
NLP engine (nlp_engine.py)
        │  regex intent classification → intent key
        ▼
responses.json  →  empathetic reply  →  back to the browser
```

- **`app.py`** — Flask + CORS server exposing `POST /chat`.
- **`nlp_engine.py`** — regex-based intent classifier (greeting, positive/negative feeling, help request, farewell, small-talk, fallback) mapped to canned replies.
- **`responses.json`** — the response library, editable without touching code.
- **`index.html` / `script.js` / `style.css`** — chat UI with a three.js 3D avatar background.
- **`speech.py`** — *optional* standalone voice module: `SpeechRecognition` (mic → text) + `pyttsx3` (text → speech).

---

## 🚀 Run it

**Backend**
```bash
pip install -r requirements.txt
python app.py            # serves the API at http://127.0.0.1:5000
```

**Frontend**

Open `index.html` directly in a browser, or serve the folder:
```bash
npx serve .              # or: python -m http.server 8080
```
The frontend posts to `http://127.0.0.1:5000/chat`, so keep the backend running.

**Voice module (optional)**
```bash
python speech.py         # requires a microphone + PyAudio
```

---

## 🔌 API

| Method | Route   | Body                      | Response              |
|--------|---------|---------------------------|-----------------------|
| POST   | `/chat` | `{ "message": "<text>" }` | `{ "reply": "<text>" }` |

---

## 💡 Possible next steps
- Swap the regex classifier for an embedding/LLM-based intent model.
- Add conversation memory and a crisis-resource hand-off for high-risk keywords.
- Persist chat history per session.

> ⚠️ This is a demo wellbeing assistant, **not** a substitute for professional mental-health care.
