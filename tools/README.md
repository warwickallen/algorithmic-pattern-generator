tools

- run-bash.cmd: Windows wrapper to execute any command via Git Bash.

Usage (from project root in any terminal):

- Run a command inside bash:
  - `tools\run-bash.cmd "echo $SHELL && bash --version"`
  - `tools\run-bash.cmd "direnv status"`

Purpose

- Ensure commands executed by agents or tasks run under Git Bash, avoiding Windows CMD/PowerShell parsing issues (e.g. hanging with "More?").
- Keeps per-project control without changing global VS Code settings.

Notes

- The script assumes Git Bash is installed at `C:\Program Files\Git\bin\bash.exe`.
- If your Git is elsewhere, update `GIT_BASH` in `tools\run-bash.cmd` accordingly.
