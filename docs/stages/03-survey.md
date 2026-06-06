# Stage 03 — Site Survey

**PIC:** surveyor · **Gate out:** none

## Goal
Capture true existing conditions: measurements, photos/video, technical notes.

## Outputs
Existing dimensions, `DocumentRef{kind:"photo"}` set, technical notes.

## UI (web)
Mobile-friendly capture at `projects/[projectId]/survey` — measurement form + media upload (Convex file storage).

## Tech choice
Convex file storage for media; simple measurement form. Optional: phone LiDAR / photogrammetry → `services` for a rough 3D base.

## AI / automation
Auto-tag photos (room/element), flag missing measurements before allowing advance.
