# Server data contract · `nitzotza.snapshot.v1`

The site runs in two modes:

| Mode | Where | Data |
|---|---|---|
| Local | GitHub Pages, or any host without the API | Synthetic demo data in `localStorage` (`consultingKnowledge`) |
| Server | The NAS, serving the same static files | A read-only snapshot from `./api/snapshot`, cached in `consultingKnowledge:server` |

The site never asks for server data when it runs on `*.github.io`, over `file:`, or when `fetch` is missing.

## Serving

- Serve the contents of `dist/` at a path such as `/brain/`, so the snapshot resolves to `/brain/api/snapshot`.
- Everything is same-origin. The browser sends the session cookie or Basic credentials automatically.
- Protect both the static files and the API with a password. On a missing or wrong password, return `401` (the site shows "נדרשת כניסה לשרת").
- The service worker never caches `/api/` responses.
- The endpoint is **read-only**: `GET` only. It never calls OpenAI, never starts processing, and never writes to the database.

## `GET ./api/snapshot`

Response `200`, `Content-Type: application/json`:

```json
{
  "contract": "nitzotza.snapshot.v1",
  "generatedAt": "2026-09-28T08:00:00Z",
  "recordings": [
    {
      "id": "string, stable, unique",
      "person": "string, the client's display name",
      "date": "YYYY-MM-DD (a longer ISO timestamp is trimmed to the day)",
      "title": "string, optional",
      "summary": "string, optional",
      "transcript": "string, required, the text the site analyzes",
      "tags": ["optional", "strings"]
    }
  ],
  "cases": [
    { "id": "string", "title": "string", "status": "open|closed", "people": ["names"], "recordingIds": ["recording ids"] }
  ],
  "followups": [
    { "id": "string", "person": "string", "title": "string", "due": "YYYY-MM-DD", "done": false, "recordingId": "optional" }
  ]
}
```

### Validation on the site

- An unknown `contract` value, or a missing `recordings` array, rejects the whole snapshot. The site keeps what it had.
- A recording without `id`, `person`, a valid `date`, or a non-empty `transcript` is skipped.
- Case `recordingIds` that do not match a recording are dropped.
- A follow-up without `id`, `person`, `title`, or a valid `due` is skipped.

### What stays on the device

- The site analyzes transcripts itself, with the same evidence-only rules as the demo. An unchanged transcript is not re-analyzed on the next sync.
- Follow-ups created on the device, recordings imported on the device, and a local "done" mark survive a re-sync. They are not written back to the server.
- If the server is unreachable, the site shows the last cached snapshot and says so.

## Speaker labels

The methodology layer (Phase E) works only on labelled speakers. Put each speaker turn on its own line, as `Name: text`, and label the consultant `היועץ` or `הרב`. Unlabelled transcripts still get problems, advice, outcomes and follow-ups.

## Not in this contract

Tier 2 (server-side LLM synthesis, `nitzotza.assistant.v1`) is separate and not enabled. See `assistant-architecture.md`.
