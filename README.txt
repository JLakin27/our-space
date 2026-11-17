OUR SPACE — TRAVEL / CHECKLIST FIX (17 NOV 2026)

Built from the exact uploaded GitHub ZIP: 'our-space-main (2).zip'.
Firestore rules were built from the SEPARATELY pasted live rules, which differ from the firestore.rules inside the GitHub ZIP. Do NOT upload the rules text to GitHub and expect it to take effect.

GITHUB PAGES (upload only these two files to the repository root):
  1. Replace index.html
  2. Replace app.js
  Leave styles.css, videos, cinematic intro, Dodo assets, and other JS unchanged.

FIREBASE CONSOLE (required to fix travel deletion):
  1. Open Firebase Console > Firestore Database > Rules.
  2. Replace the rules with FIRESTORE_RULES_PUBLISH_IN_FIREBASE_CONSOLE.txt
     (or simply add 'allow delete: if invited();' inside match /places/{placeId}).
  3. Click Publish.
  4. Do not edit Firestore rules for the separate /placesTo checklist.

WHAT CHANGED
  * /places delete now allowed for the two invited accounts (both can already see Delete).
  * Places To 'Send suggestion' button re-enabled after the save finishes.
  * Removed top 'Suggest a place' button from travel page. New suggestions must be started by clicking the map or selecting a geocoding search result.
  * All other site features left alone.

SMOKE TEST
  A. Send a travel suggestion from search / map; immediately delete via details.
  B. Add one checklist idea; immediately add another without refreshing.
  C. Try normal Spotify, kisses, intro, map display and normal sign-in.

DO NOT UPLOAD README OR FIRESTORE_RULES_PUBLISH_IN_FIREBASE_CONSOLE.txt TO GITHUB; Firebase rules belong in Firebase Console.
