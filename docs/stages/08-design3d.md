# Stage 08 — 3D Design / Visualization

**PIC:** artist_3d · **Gate out:** client_approval

## Goal
Interactive 3D the client can explore, plus photoreal renders of key views.

## Inputs
Approved layout (Stage 07), material/style from concept (Stage 06).

## Outputs
`DocumentRef{kind:"render"}` (final render images), 3D scene (glTF) reference.

## UI (web)
R3F viewer at `projects/[projectId]/design3d` — orbit, walkthrough, swap materials.

## Tech choice — **React Three Fiber + drei** (Three.js)
R3F is the right way to use Three.js in React/Next. Use drei helpers
(`<OrbitControls>`, `<Environment>`, `useGLTF`, `<Bvh>`).

### Keep it fast (the "performa tidak berkurang" rules)
- glTF + **Draco/Meshopt** compression for models.
- **Instancing** for repeated furniture (chairs, tiles).
- `frameloop="demand"` — only re-render on interaction.
- **LOD** + frustum culling; lazy-load heavy rooms.
- **Bake lighting** where possible; avoid many realtime shadows.
- Load the viewer in a client component, `dynamic(() => ..., { ssr: false })`.

### Don't do in the browser
Real-time path tracing / full photoreal. It tanks performance.

## Heavy compute — `services/render`
For photoreal output: capture a **depth / canny / normal** map from the R3F
viewport → send to `services/render` → Stable Diffusion + ControlNet on a GPU
(Replicate/Fal) → store the returned image. So: **Three.js = editor/preview, AI =
final render.**
