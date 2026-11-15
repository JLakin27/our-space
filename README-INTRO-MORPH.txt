OUR SPACE — CINEMATIC INTRO CARD → HOMEPAGE DODO (TEST VERSION)

This update is based on the earlier cinematic integration applied to your supplied our-space-main.zip.

REPLACE THESE THREE FILES in the ROOT of your existing GitHub Pages repository:
  index.html
  styles.css
  cinematic-intro.js

LEAVE UNCHANGED:
  app.js
  dodo-home.js
  dodo-world.js
  cinematic-assets/dodo-intro-mobile.mp4
  cinematic-assets/dodo-intro-desktop.mp4
  all dodo-assets and all Firebase files/rules

WHAT CHANGED:
  * Branded cream opening screen with the existing Our space. wordmark
  * Rounded video card: portrait on mobile / landscape on desktop
  * At the end the card flies/shrinks into the ACTUAL homepage Dodo home rectangle
  * The app becomes visible under the fading backdrop during the movement
  * Homepage Dodo stays paused until the intro finishes
  * Temporary TEST-only "Replay Dodo intro" button in desktop/mobile sidebar
  * Normal sessionStorage once-per-tab intro rule remains unchanged
  * On user-requested replay from another section, it navigates home and scrolls up first
  * Skip, browser-background and video-load failure still open the app immediately

TEST THIS:
  1. Fresh tab while signed in: new branded card starts automatically.
  2. Video plays, meadow ends, card shrinks toward Dodo's homepage home.
  3. Open sidebar > Replay Dodo intro; repeat to fine-tune design.
  4. Refresh same tab: no automatic replay.
  5. Sign out / sign in: normal authentication should work.
  6. Check on mobile portrait and desktop landscape.

REMOVING TEST CONTROL LATER:
  Delete the single <button id="cinematic-intro-replay" ...></button> from index.html.
  The JS safely handles the replay button being absent; CSS can stay or the
  .cinematic-intro-replay selector can be deleted too.

NOTES:
  The previously integrated MP4 files must already be in cinematic-assets.
  No Firebase rules, Firestore collections, or settings are changed.
  JavaScript syntax and existing HTML ID preservation have been checked.
  Live visual Firebase testing was not possible in this environment.
