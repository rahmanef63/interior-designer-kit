# Workflow — 16 stages

`Inquiry → Briefing → Survey → Proposal → Kontrak+DP → Konsep → Layout → 3D →
Gambar Kerja → RAB Final → Procurement → Produksi → Instalasi → QC → Handover →
After Sales`

Each stage has a primary PIC, expected outputs, and a **gate** that must clear
before the project advances (enforced in `packages/convex/convex/workflow.ts`).

| # | Stage | PIC | Output | Gate | AI augmentation |
|---|-------|-----|--------|------|-----------------|
| 1 | Lead / Inquiry | Admin/Sales | Data client, jadwal survey | — | Parse WA/IG/email → struktur |
| 2 | Briefing | Designer | Design brief, scope awal | — | Voice note → transcribe → draft brief |
| 3 | Survey Lokasi | Surveyor | Ukuran existing, foto, catatan teknis | — | Auto-tag foto, deteksi item |
| 4 | Proposal | Estimator | Proposal, quotation awal | Approval klien | Draft scope + harga dari brief |
| 5 | Kontrak & DP | Admin/Owner | Kontrak, invoice DP | Pembayaran | Generate kontrak dari template |
| 6 | Konsep | Designer | Moodboard, palette, style | Approval klien | Image-gen konsep, ekstrak palette |
| 7 | Layout | Designer | Denah layout, zonasi, flow | Approval klien | Auto-layout & sirkulasi |
| 8 | 3D / Visual | 3D Artist | Render final | Approval klien | AI render dari depth/canny viewport |
| 9 | Gambar Kerja | Drafter | Drawing produksi & site | QC internal | Auto-generate denah/titik dari model |
| 10 | RAB Final | Estimator | RAB final | Approval klien | Quantity takeoff dari model |
| 11 | Procurement | Admin/PM | List belanja, PO, jadwal barang | — | Auto-PO dari RAB, cek harga |
| 12 | Produksi | Workshop | Furniture siap kirim, QC | QC internal | Jadwal produksi otomatis |
| 13 | Site / Instalasi | Site team | Progress lapangan, update | — | Ringkas progress, deteksi delay |
| 14 | Quality Control | PM | Punch list, revisi minor | QC internal | Auto punch list dari foto (vision) |
| 15 | Handover | PM/Owner | BAST, dokumentasi, garansi | Pelunasan | Generate BAST + dokumentasi |
| 16 | After Sales | Admin/PM | Follow-up, review, portfolio | — | Follow-up terjadwal, minta review |

## Spine + modules

- **Spine (global):** Project entity, the 16-stage state machine, clients,
  members/roles, documents, finance, notifications, dashboard. ~80% of the app.
- **Modules (per stage):** each stage contributes its own data + views, plugged
  into the same Project. See `docs/stages/` for per-module specs.

## Two planes

- **App plane** — Next.js + Convex + Vercel. Realtime CRUD, light, all stages.
- **Compute plane** — `/services` (Python, GPU). 3D render, CAD/DXF, takeoff.
  Called async from Convex actions. This split is what keeps the app fast.

## Hybrid execution

- **Local (Windows):** `local/scripts/*.bat` → function-calling with a key in
  `local/.env`. Good for offline / heavy local work.
- **Web:** BYOK — users store their own key (encrypted) and inference runs in
  `packages/convex/convex/ai.ts`.
