Our Space – Dodo refinements (15 November 2026)

Built directly from the user-provided current GitHub export.

REPLACE in GitHub root:
  index.html
  styles.css
  dodo-home.js

REPLACE in GitHub dodo-assets/ folder:
  sprites.json

ADD to GitHub dodo-assets/ folder:
  whacked.webp
  die.webp

LEAVE EVERYTHING ELSE UNCHANGED: app.js, existing sprite sheets, Firebase rules, and all other files.

Changes: Login starts covered (no Dodo peek), background blurred behind dialog; interaction hints now below the Dodo home; whacked and die/fall-down added as additional tap reactions.

Note: The die reaction plays once and returns to idle. Dodo animations start after the auth dialog is hidden. No Firebase changes.
