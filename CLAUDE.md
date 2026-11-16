# Working in this repo

## Roj Habit (`habits/`)
- **Every change to the app raises its version.** Before committing, run `npm run bump` in `habits/`
  (`-- minor` for new features or redesigns, plain for fixes) and add a line for that version at the
  top of `habits/CHANGELOG.md`, written in Hinglish like the rest of it. The script updates
  `package.json`, `package-lock.json` and `www/version.js`; Android, the Mac build and the release
  page read the version from there.
- Before pushing: `npm test`, then `node scripts/preview.js` and open `dist/preview.html` to check it
  loads (it inlines every file the page needs; a missing file shows a blank page).
- The repo is public: never commit signing keys or other secrets.
