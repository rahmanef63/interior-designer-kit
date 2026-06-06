"""Render service — photoreal interior render from a 3D viewport capture.

Takes a depth/canny/normal map exported from the R3F viewer and runs it through
an AI model (Stable Diffusion + ControlNet) via Replicate or Fal. GPU lives at
the provider, not here. This service just orchestrates + stores the result.
"""
import os
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ID render service")


class RenderRequest(BaseModel):
    project_code: str
    control_image_url: str  # depth/canny map from the viewport
    prompt: str             # "scandinavian living room, warm light, photoreal"
    control_type: str = "depth"


@app.get("/healthz")
def healthz():
    return {"ok": True, "provider_configured": bool(os.getenv("REPLICATE_API_TOKEN") or os.getenv("FAL_KEY"))}


@app.post("/render")
async def render(req: RenderRequest):
    # async with httpx.AsyncClient() as client:
    #     call Replicate/Fal with control_image_url + prompt + control_type
    #     poll until done, get output image url
    #     return {"image_url": ...}
    return {"project": req.project_code, "control": req.control_type, "status": "stub"}
