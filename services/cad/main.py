"""CAD service — generate DXF working drawings with ezdxf.

Compute plane: deploy separately and call from a Convex action.
This is a stub: wire the ezdxf body where marked.
"""
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ID CAD service")


class Wall(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class FloorPlan(BaseModel):
    project_code: str
    walls: list[Wall]


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.post("/dxf")
def make_dxf(plan: FloorPlan):
    # import ezdxf
    # doc = ezdxf.new("R2010")
    # msp = doc.modelspace()
    # for w in plan.walls:
    #     msp.add_line((w.x1, w.y1), (w.x2, w.y2))
    # path = f"/tmp/{plan.project_code}.dxf"
    # doc.saveas(path)
    # upload `path` to storage, return its URL
    return {"project": plan.project_code, "walls": len(plan.walls), "status": "stub"}
