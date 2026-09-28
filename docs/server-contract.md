# Server data contract · `nitzotza.snapshot.v1`

The site runs in two modes:

| Mode | Where | Data |
|---|---|---|
| Local | GitHub Pages, or any host without the API | Synthetic demo data in `localStorage` (`consultingKnowledge`) |
| Server | The NAS, serving the same static files | A lightweight list from `./api/site/recordings` (all recordings, paged); each recording's full text loads when it is opened. Legacy fallback: `./api/snapshot` |

The site never asks for server data when it runs on `*.github.io`, over `file:`, or when `fetch` is missing.

## Serving

- Serve the contents of `dist/` at a path such as `/brain/`, so the snapshot resolves to `/brain/api/snapshot`.
- Everything is same-origin. The browser sends the session cookie or Basic credentials automatically.
- Protect both the static files and the API with a password. On a missing or wrong password, return `401` (the site shows "נדרשת כניסה לשרת").
- The service worker never caches `/api/` responses.
- The endpoint is **read-only**: `GET` only. It never calls OpenAI, never starts processing, and never writes to the database.

## v2 (current): lightweight list + detail on open

The site first calls the list API. Only if it answers 404 (or an unknown contract) does the site fall back to the legacy `./api/snapshot` below.
Paths live under `./api/site/` so they never collide with the older `./api/recordings` routes used by the legacy UI.
All endpoints: `GET` only, same password as the site, `Cache-Control: no-store`, SELECT only, and never log transcript or analysis bodies.

### `GET ./api/site/recordings?offset=0&limit=100[&q=...]`

```json
{
  "contract": "nitzotza.list.v1",
  "total": 367,
  "offset": 0,
  "limit": 100,
  "generatedAt": "2026-09-28T10:00:00Z",
  "items": [
    {
      "id": "string, stable",
      "plaudFileId": "string or null",
      "title": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM or null",
      "duration": 2460,
      "person": "string or null",
      "status": "processing status or null",
      "aiStatus": "AI/extraction status or null",
      "hasTranscript": true,
      "hasPlaud": true,
      "snippet": "short summary, at most ~300 characters"
    }
  ],
  "cases": [],
  "followups": []
}
```

- `total` is the count for the query, never a hard-coded number. The site keeps requesting pages (`offset` += items received) until it has `total` items.
- `limit` up to 100 is enough; the server may cap it.
- Order: newest first (`date`, then `time`).
- **Items must not contain `transcript` or the full PLAUD analysis.** The site drops such fields if they appear.
- `q` (optional): server-side search over title, transcript_full and plaud_analysis_full (for example `ILIKE '%' || $1 || '%'`, or full-text search). Returns matching items in the same shape and `total` = number of matches. The site uses it for recording search, so recordings whose text is not loaded in the browser are still found.
- `cases` and `followups` (optional) are read from the first page only.

### `GET ./api/site/recordings/:id`

```json
{
  "contract": "nitzotza.recording.v1",
  "id": "string",
  "plaudFileId": "string or null",
  "title": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM or null",
  "duration": 2460,
  "status": "string or null",
  "aiStatus": "string or null",
  "summary": "string or null",
  "transcript": "transcript_full, complete, one turn per line as `[mm:ss] Speaker: text`",
  "plaud": "plaud_analysis_full, complete, not truncated"
}
```

- `404` for an unknown id.
- Optional `knowledge`: the content of `data/site-knowledge/<id>.json` on the NAS when that file exists (contract `nitzotza.knowledge.v1`, produced on the Mac by `scripts/extract-local.mjs` with a local LM Studio model). The list item then has `"hasKnowledge": true`. The site re-verifies every quote against `transcript` and drops any quote it cannot find. These files are separate from RAW, CLEAN and the database; deleting them returns the site to its rule-based analysis.
- The site loads this only when a recording is opened, plus the newest ~40 recordings in the background so the knowledge pages have material. At most 80 opened recordings stay in browser memory; none are written to local storage.
- Tabs: "תמלול מקור" ← `transcript`; "ניתוח PLAUD" ← `plaud`; "ידע שחולץ" ← the site's own analysis of `transcript`.

## Legacy v1

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
      "plaud": "string, optional, PLAUD's own summary or notes for the recording (shown in the \"ניתוח PLAUD\" tab)",
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

The methodology layer (Phase E) works only on labelled speakers. Put each speaker turn on its own line, as `Name: text`, and label the consultant `היועץ` or `הרב`. The consultant is Rabbi Nitzotza Shalom Yosef Barabi: in PLAUD transcripts he appears as `הרב`, as `ניצוצא שלום יוסף ברבי`, and often as `Speaker 1` (sometimes `Speaker 2`). With generic labels the site infers him from explicit advice, and prefers `Speaker 1` only when there is no clear winner. Unlabelled transcripts still get problems, advice, outcomes and follow-ups.

## Not in this contract

Tier 2 (server-side LLM synthesis, `nitzotza.assistant.v1`) is separate and not enabled. See `assistant-architecture.md`.


## `nitzotza.knowledge.v1` (local AI extraction)

```json
{
  "contract": "nitzotza.knowledge.v1",
  "id": "recording id",
  "model": "dictalm-3.0-24b-thinking",
  "promptVersion": "k1",
  "transcriptSha256": "hash of the transcript it was made from",
  "generatedAt": "ISO time",
  "consultant": "speaker label of the consultant",
  "kept": 12, "dropped": 3,
  "items": [
    { "type": "problem|advice|reasoning|outcome|result|followup|principle", "quote": "verbatim from the transcript", "summary": "up to 10 words", "adviceIndex": 0 }
  ]
}
```

`quote` is always an exact excerpt; the extractor drops anything it cannot find verbatim, and the site checks again. `summary` is the model's short title and is shown above the quote, never instead of it.
