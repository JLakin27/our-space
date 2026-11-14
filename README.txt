OUR SPACE — DODO HOME V2

Built from your verified working pre-Dodo baseline plus the corrected Dodo integration.

Replace ONLY these GitHub files:
  index.html
  styles.css
  dodo-home.js

LEAVE AS THEY ARE:
  app.js
  dodo-assets folder
  firestore.rules / Firebase rules

Changes:
- Dodo loops his gentle sway idle animation while visible, instead of freezing.
- He usually wanders away about 25–40 seconds after returning, stays away around 10–17 seconds.
- When he is home: a discreet 'Tap me!' label. When away: '🔔 Call me back'.
- Tapping the empty scene brings him back; tapping him triggers peck, jump or squawk.
- Stops all animation while app/tab is hidden or scene isn't in viewport.
- Honours reduced-motion preferences.

Please verify on your live GitHub Pages site; no live Firebase test was performed.
