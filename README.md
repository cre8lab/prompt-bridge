# PromptBridge

Turn messy questions, social posts, notes, or half-formed ideas into clean, copy-ready Claude prompts — no login required.

## What it is

PromptBridge is a no-login, privacy-aware web app. You paste rough input. It returns:

- A cleaned-up version of your intent
- Reasonable assumptions it made
- A short public/social reply you can post as a comment
- A full, copy-paste-ready Claude prompt
- A shorter Claude prompt for quick use
- Suggested adjustments before you paste

The app does **not** answer your original question. It structures it into a better prompt.

## How it works

1. User pastes messy input into the textarea.
2. User selects a mode (Practical, Deep, Skeptical, etc.) and a length (Short, Balanced, Detailed).
3. The frontend builds a privacy-safe Context Card with only: device class, browser language, timezone, selected mode, selected length.
4. The API route sends the raw input and Context Card to an OpenAI model.
5. The model returns structured JSON with all six output sections.
6. The user can copy the social reply, full Claude prompt, or shorter prompt directly.

## Privacy principles

- No login, no account required
- Raw prompts are never stored
- Context Card contains only: device class, language, timezone, mode, length — nothing personally identifying
- No browser fingerprinting (no canvas, WebGL, or font enumeration)
- No cross-site tracking
- No people-search or data-broker enrichment
- Local preferences may be stored in `localStorage` and can be cleared anytime via the UI

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd prompt-bridge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your API key

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

> **Important:** Use an official OpenAI API key, not a personal ChatGPT subscription. API keys and ChatGPT Plus are different products. Get an API key at platform.openai.com.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sample input

```
I saw someone post on Facebook about how this supplement called berberine is basically
"nature's ozempic" and everyone in the comments was going crazy. Is this actually true
or is it just another health trend? I want to understand the real science.
```

## Expected output

- **Cleaned-up intent:** What you actually want to know about berberine vs. Ozempic.
- **Assumptions:** That you're asking about weight loss, that you want science-based information, etc.
- **Social reply:** A short comment you could post in that thread.
- **Full Claude prompt:** A structured, self-contained prompt asking Claude to separate the evidence from the hype.
- **Shorter prompt:** A quick version for fast use.
- **Suggested adjustments:** E.g., "Specify if you have diabetes or pre-diabetes" or "Ask Claude to include dosage considerations."

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add `OPENAI_API_KEY` as an environment variable in the Vercel project settings.
4. Deploy.

The app is fully stateless — no database setup required.

> **Production note:** Use official API keys, not personal Claude.ai or ChatGPT subscriptions. Personal subscriptions are consumer products and cannot be used to power third-party apps.

## Future improvement ideas

- Screenshot OCR (paste an image, extract text automatically)
- Browser extension (right-click any text, send to PromptBridge)
- Saved prompt styles / custom personas
- Niche templates (medical, legal, startup, coding)
- Public reply generator with platform-specific tone tuning
- Waitlist / payment validation before production scaling
- Analytics limited to anonymous usage counts (no personal data)
- Switch LLM backend to Claude (Anthropic API) for brand alignment
