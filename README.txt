DODO WORLD V2 — install over V1

Replace these files in the ROOT of your GitHub Pages repository:
  index.html
  styles.css
  dodo-world.js
  dodo-home.js

Leave app.js, sprite JSON files, WebP assets and Firebase rules unchanged.

Changes: Dodo ground-level barn position, bird in front of barn, more left/right facing, sun and hot-air balloon controls, snack action, home mascot pauses during expanded world, world RAF pauses when closed/hidden, removed header/footer tagline, clearer Visit his world button.

Note: dodo-home.js is included because its visibility logic needs to pause while Dodo World is open. The world scripts never save to Firebase.
