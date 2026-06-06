"""Takeoff service — quantity takeoff / BoQ from the 3D model.

Given furniture + surface data extracted from the glTF scene, compute material
quantities (board area, HPL sheets, edging metres, etc.) to seed the RAB.
"""
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ID takeoff service")

SHEET_AREA_M2 = 2.88  # standard 1220 x 2440 plywood sheet


class Panel(BaseModel):
    name: str
    width_m: float
    height_m: float
    qty: int = 1


class TakeoffRequest(BaseModel):
    project_code: str
    panels: list[Panel]


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.post("/takeoff")
def takeoff(req: TakeoffRequest):
    total_area = sum(p.width_m * p.height_m * p.qty for p in req.panels)
    edging_m = sum(2 * (p.width_m + p.height_m) * p.qty for p in req.panels)
    sheets = round(total_area / SHEET_AREA_M2 + 0.5)  # round up with waste buffer
    return {
        "project": req.project_code,
        "board_area_m2": round(total_area, 2),
        "plywood_sheets": sheets,
        "edging_m": round(edging_m, 2),
    }
