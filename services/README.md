# services/ — compute plane (Python)

Heavy jobs that must NOT run on Vercel/Convex (CPU/GPU, long-running). Each is a
standalone FastAPI service, deployed separately (Railway / Fly / Modal), and
called asynchronously from a Convex `action`. Results (files/URLs) are stored
back in Convex.

| Service | Job | Key libs |
|---|---|---|
| `cad/` | Working drawings → DXF/DWG | ezdxf |
| `render/` | Photoreal render from 3D depth/canny (AI) | httpx → Replicate/Fal |
| `takeoff/` | Quantity takeoff / BoQ from the 3D model | numpy (optional) |

Pattern (web): `web → Convex action → fetch(SERVICE_URL) → store result`.
Why separate: Vercel functions time out and have no GPU; Convex actions are for
orchestration, not number-crunching. Keeping this split is what protects app
performance.

Run one locally:

```bash
cd services/cad
python -m venv .venv && . .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --port 8002 --reload
```
