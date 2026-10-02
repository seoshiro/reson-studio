# Verification and limits

RESON is an original visual loudspeaker concept. Geometry, finishes and displayed dimensions are illustrative. No acoustic response, component suitability, fabrication tolerance or safety claim is made.

## Audit rounds

1. Implemented and visually inspected the assembled and separated geometry on desktop, mobile and small screens. Fixed collection restoration with image thumbnails and truthful storage failure reporting.
2. Audited full EN/RU/KK configuration, saved comparisons, reverse scroll and responsive views. Fixed translated control overlap and preserved complete option words.
3. Audited 200% text, reviewed import replacement, cancelled deletion, undo, six-design limits and repeated language changes. Enlarged text uses flowing construction content. Production subpath and security policy were checked.

## Checks

- ESLint, strict TypeScript, four meaningful unit tests and production build with artifact checks.
- Ten regular Chrome contexts: desktop 1440×1000, laptop 1280×800, tablet 768×1024, mobile 390×844, small mobile 320×568, RU and KK at 390×844 and 320×568, landscape 844×390.
- Forward and reverse scroll samples, camera containment, caption separation, all configuration controls, named alternatives, side-by-side comparison, persistence after reload, unique names and six-design capacity.
- Geometry assertions wait for the matching painted frame. A regression deliberately delays animation callbacks by 140 ms and verifies forward/reverse containment with the same two-pixel bounds; this prevents sampling pending geometry against the previous camera.
- Window resize preserves the current construction progress while inside the study. Phone orientation changes stay in the current chapter rather than jumping out of the shortened scroll region.
- Keyboard rotation, native mobile touch scrolling, interrupted workflows, reviewed valid imports, malformed/dimension-invalid/duplicate imports, cancellation, collection undo and JSON download.
- Import and deletion confirmations commit on form submission; cancellation clears pending state immediately. Delayed close callbacks cannot act on a later dialog, and revision checks discard stale asynchronous file reads. These repeat/interruption regressions run first in the browser audit.
- Forced no-WebGL fallback, actual WebGL context loss with continued saving, reduced motion, denied storage and automated WCAG A/AA checks.
- Nine focused 200% text contexts across EN/RU/KK at 320, 390 and 768 pixels inspect actual text ranges, empty states, saving and accessibility. Long headings, construction links, view controls and save controls wrap without global content clipping.
- Sixteen extreme geometry configurations; rendering stops while idle and outside the viewport. No third-party runtime requests.

## Continuous motion evidence

Desktop and mobile forward/reverse videos and telemetry are captured by `scripts/capture-motion.mjs`, including interrupted scrolling and orientation changes. Sampled frame sequences were visually inspected. The recorded local environment returned zero page errors and contained model bounds throughout 2,162 desktop and 2,302 mobile frames. These are local Chrome observations, not a claim about every device.

The local evidence directory contains production-browser captures and reports, continuous WebM recordings, telemetry and review sheets. Use `RESON_URL` to run the same browser checks against a deployed release. CI validates the production subpath before GitHub Pages deployment.

## Limits

Browser-local data; maximum six named designs; exports contain configurations, not embedded photographs. Thumbnail images are regenerated from original geometry on import when WebGL is available. Without WebGL, material cards and a static original model image remain usable. No accounts, cloud sync, sound playback, acoustic simulation or checkout. Physical-device Safari was not tested.
