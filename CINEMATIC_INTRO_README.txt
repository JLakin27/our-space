OUR SPACE — CINEMATIC DODO INTRO (15 NOV 2026)

Built from the exact uploaded our-space-main.zip baseline.

REPLACE in repository root:
  index.html
  styles.css
  app.js
  dodo-home.js
ADD to repository root:
  cinematic-intro.js
ADD folder in repository root:
  cinematic-assets/dodo-intro-mobile.mp4
  cinematic-assets/dodo-intro-desktop.mp4

Do NOT upload the containing ZIP or containing folder itself.
Do NOT replace dodo-world.js, dodo-world-sprites.json, dodo-assets, Firestore rules, or anything else.

BEHAVIOUR:
 - Firebase checks sign-in first. Login only displays if needed.
 - On a signed-in fresh tab session, overlay video runs once and fades into homepage.
 - Reloads, ordinary navigation, and returning from background won't replay it.
 - A user signing in within the session can see the intro once.
 - Skip or Esc closes it; video errors/autoplay block/slow loading also fail open to the site.
 - Reduced-motion preference skips the intro entirely.
 - No video playback behind login; small homepage Dodo pauses while intro is visible.
 - #map/#music/deep-linked pages skip the intro.
 - Video is muted intentionally, for autoplay compatibility.
 - This is not yet a true PWA launch detector: sessionStorage is a practical interim approximation.

TEST:
 - Signed in: new tab opens intro and fades to website. Refresh does not replay.
 - Sign out, refresh: see login and no video. Sign in: intro at most once per tab.
 - Skip, desktop/phone orientation, mobile home Dodo resumes, Dodo's World works.
 - Kisses, Music, map, navigation and profiles remain intact.
