Purpose

This folder contains workspace-specific editor settings for this project. It intentionally forces the integrated terminal to use Git Bash so that environment loading is handled by bash and direnv, avoiding PowerShell-related issues (e.g. "direnv edit ... exit status 1").

Key points

- Scope: Workspace-only. These settings do not affect your global editor configuration or other projects.
- Terminal: Sets the default integrated terminal profile to Git Bash (`C:\\Program Files\\Git\\bin\\bash.exe` with `-l`) so bash startup files load and `direnv` works consistently.
- direnv: With bash as the terminal, the `.envrc` in the repo is allowed/loaded normally. If you still use a direnv extension, you can disable it to avoid duplicate prompts; bash + direnv is sufficient.
- Team safety: This change only alters the default terminal profile when the workspace is opened. It has no runtime impact on builds, tests, or production artefacts.

Changing or removing

- If you prefer a different shell in this project, edit `settings.json` in this folder.
- To revert to your editor's global default, delete `.vscode/settings.json` from this project.
