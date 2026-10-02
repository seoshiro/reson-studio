# RESON

An original loudspeaker design studio. Configure a cabinet, surface, driver trim, grille and base; explore a reversible construction sequence; save named alternatives, compare them, and export or import a validated collection.

Live: https://seoshiro.github.io/reson-studio/

This is an illustrative visual study. It is not an acoustic simulation, an electronics design or a manufacturing specification. No prices, audio playback, analytics, accounts or paid services are included.

## Use

The studio opens with working controls. Drag with a mouse or focus the model and use arrow keys. On touch screens, use the three view buttons; vertical swipes remain native scrolling. Scroll through Construction to separate and reassemble the parts. The parts slider provides direct control, including with reduced motion. Turning motion off disables the scroll animation.

Save up to six uniquely named designs in this browser. Choose two Compare buttons for a side-by-side view. Export JSON for a portable backup. Import accepts only version 1 collections with known finish values, valid dimension steps, unique names and at most six designs. The collection is replaced only after confirmation. Undo restores configuration and collection actions for the current session. Browser storage can be unavailable: export remains available.

EN / RU / KK. Keyboard controls, native dialogs, reduced motion, a static 3D fallback image, responsive controls and local fonts. Three.js geometry and wood textures are procedural and original. Rendering runs on demand, pauses outside the viewport and caps device pixel ratio.

## Development

Node 24: `npm ci`, `npm run dev`. `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:browser`.

## Visual references

The material restraint of [B&O Beolab 8 craftsmanship](https://www.bang-olufsen.com/en/us/story/beolab-8-craftsmanship), the visible driver details of [KEF LS50 Meta](https://international.kef.com/products/ls50-meta), and the rounded enclosure language of [Genelec](https://www.genelec.com/key-technologies/minimum-diffraction-enclosure-technology) informed the design research. RESON is its own fictional two-driver concept; no geometry, product imagery, specifications, logos, claims or commercial copy from these brands are used.

See [verification and limits](docs/AUDITS.md). Third-party license notices are in `public/licenses`.
