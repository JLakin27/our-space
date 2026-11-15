OUR SPACE — DODO'S EXPANDED WORLD (V1)

Built on the 15 November login-no-flash update you most recently installed.

GITHUB: REPLACE
- index.html
- styles.css

GITHUB: ADD
- dodo-world.js (repository root)
- dodo-world-sprites.json (repository root)
- dodo-assets/run.webp (inside your existing dodo-assets folder)

GITHUB: KEEP UNCHANGED
- app.js
- dodo-home.js
- All other existing dodo-assets (including whacked.webp)
- Firebase rules and data

What it does:
- Small Explore ↗ button above the existing Dodo box
- Full-screen meadow on mobile, large modal on desktop
- Natural left/right walking and occasional running
- Tap Dodo for jump/peck/squawk/whacked reactions
- Tap the barn to walk inside; Zzzs appear; tap again to wake him
- Preserves sleeping state and location while that browser page stays open
- Stops animations when closed or browser tab is hidden
- No in-app purchases, coins, chores, Firebase writes or persistent user data

Note: You must host it via GitHub Pages or an HTTP server; opening
index.html directly with file:// will prevent loading the sprite JSON.

The ZIP intentionally includes ONLY the five files you need to add/replace.
The app's existing functionality is left untouched.
