# Unity Grammar Defense REMASTERED

This repo hosts the auto-update files for the Unity Grammar Defense desktop app.
The `releases/` folder always contains the latest Windows build - the game
checks `releases/latest.yml` on startup to see if a newer version is available.

**Important:** `releases/UnityGrammarDefense-Setup-latest.exe` is a stable-named
copy of the current version, kept in sync with the versioned file every time a
new version is published. The download page (`index.html`) and its email link
point to this stable filename specifically so they never go stale when a new
version replaces the versioned file. When publishing a new version, always
update this copy too - don't just replace the versioned .exe.
