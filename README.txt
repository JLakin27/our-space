OUR SPACE — DODO WHEEL SEGMENTS FIX (17 NOV 2026)

Based on the app.js in our-space-fixes-17nov.zip (the last Travel & Checklist fix).

UPLOAD TO GITHUB:
Replace app.js in the root of your repository.
Do not replace any other files. No Firebase rules change.

FIX:
The wheel previously showed four CSS placeholder segments until a spin.
It now draws one segment per approved (unfinished) checklist idea as soon
as Firestore loads the list, whenever the list changes, and when returning
to the page. If the list changes during a spin, the wheel updates after
that spin finishes.

TEST:
1. Open Our places to without spinning: segment count should match the
   approved item count, not pending suggestions or completed items.
2. Add/approve an idea and return to the page: count should update.
3. Spin: it should still choose from approved items only.
