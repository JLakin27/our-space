DODO + AUTH REFRESH FIX — 15 November 2026

Replace ONLY the following four root-level files on GitHub:
- index.html
- styles.css
- app.js
- dodo-home.js

Leave dodo-assets, sprites.json, other files, and Firebase rules alone.

Changes:
1. Removed die/fall-down from the Dodo reaction selection and preload. No asset deletion required.
2. The login modal is hidden by default, so it does not flash when refreshing an authenticated session.
3. A neutral Opening Our Space... screen conceals the homepage until Firebase finishes checking auth.
4. On confirmed sign-out or an expired session, the login form appears with its existing heavy background blur.
5. In Local preview, the neutral loading screen is removed immediately.

app.js IS part of this update, unlike previous Dodo-only fixes. It has ONLY minimal changes to authentication visibility handling. All other app logic is unchanged.

Verify by refreshing while signed in (no login flash), signing out (login shows), signing back in (homepage shows), and tapping the Dodo (only peck/jump/squawk/whacked).
