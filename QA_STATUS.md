# QA Status - PPVG Web App

## Detected Bugs / UX Gaps
- **Download button exports a text file instead of a video asset.** The current implementation serializes the approved script and saves it as `*.txt`, which does not match the "Download video" expectation from the UI and PRD. Users cannot retrieve a playable promo video from the interface yet.
- **Generated scripts can exceed the one-minute (≈180-word) requirement.** Feature lists are injected verbatim without trimming or counting words, so long descriptions break the runtime constraint promised in the PRD. We should enforce length control or provide feedback before approval.
- **Preview pane does not surface any playback controls when no audio track loads.** If the placeholder MP3 fails to load, the preview silently shows an empty audio element. We should surface an error toast or fallback message so users know generation failed.

## Missing Access & API Integrations
- **Authentication** – Email/password is front-end only; Google/Apple buttons do not connect to real OAuth providers. No session/token handling or backend validation exists.
- **LLM Script Generation** – Scripts are mocked locally via `simulateLLMScript`. We still need access credentials for the chosen LLM provider (e.g., OpenAI, Anthropic) plus a backend endpoint to call it securely.
- **RAG Pipeline** – Uploaded guideline files stay in memory; there is no vector store, embedding service, or retrieval endpoint. Requires storage (S3/GCS) + embedding model + database such as Pinecone or pgvector.
- **Fine-Tuning Workflow** – Submissions currently flip a status pill only. We need API keys and job orchestration for the selected fine-tuning service (OpenAI, Hugging Face) plus callback handling.
- **Video Synthesis** – The "Generate video" step mocks the output (static image + MP3). We still require Infinite Talk lip-sync API access, a TTS service (e.g., ElevenLabs), and storage/CDN for rendered MP4 files.
- **Analytics & Logging** – Metrics count in-memory values only. No analytics SDK (e.g., Segment, Mixpanel) or server-side event logging is wired.

## Recommended Next Steps
1. **Stand up a lightweight backend** to handle auth handshakes, secure API keys, and broker requests to LLM, RAG, and video services.
2. **Integrate real LLM + RAG flow**: persist uploaded documents, generate embeddings, and feed retrieved context into scripted prompts with token/word-length guards.
3. **Wire Infinite Talk and TTS APIs** to return an actual MP4 (or at minimum a streaming URL) and update the preview/download logic accordingly.
4. **Persist history and analytics** via a database (e.g., Postgres + Prisma) and emit usage metrics to an analytics platform.
5. **Harden the UX** with error toasts, loading guards, and responsive states (mobile stepper layout, retry buttons when generation fails).
6. **Add automated tests** (unit for helpers, integration/e2e for the creation flow) and CI hooks to prevent regressions as the real integrations land.
