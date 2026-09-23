# GFG-GitHub-Pusher
🚀 One-click sync: solve on GeeksforGeeks, push straight to GitHub.
# GFG GitHub Pusher

A Chrome extension that pushes your solved [GeeksforGeeks](https://www.geeksforgeeks.org/) problems directly to a GitHub repository — no manual copy-pasting required.

## Features

- 📄 Automatically grabs the problem title and your solution code from the GFG code editor (Ace editor support, with a `<textarea>` fallback)
- 🗂️ Organizes solutions into folders by category (Arrays, Strings, Trees, Graphs, etc.)
- 🌐 Supports multiple languages: Java, C++, Python, C, JavaScript
- 🔁 Detects existing files and updates them instead of duplicating
- 💾 Remembers your GitHub username, repo, and token between sessions (via `chrome.storage.local`)

## How It Works

1. Solve a problem on GeeksforGeeks in the built-in code editor.
2. Click the extension icon to open the popup.
3. Enter your GitHub username, repository name, and a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope.
4. Pick a category and language for the solution.
5. Click **🚀 Push to GitHub**.

The extension reads the current tab's problem title and code, then commits the file to:

```
GeeksForGeeks/<Category>/<problem-title>.<ext>
```

in your specified repository, using the GitHub Contents API.

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the project folder.
5. Pin the extension for easy access.

## Setup

You'll need a GitHub Personal Access Token:

1. Go to [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens).
2. Generate a token with `repo` scope (or a fine-grained token with read/write access to Contents on the target repo).
3. Paste it into the extension's **GitHub Token** field.

> ⚠️ **Security note:** Your token is stored locally in your browser via `chrome.storage.local` and is only ever sent to `api.github.com`. Never share your token or commit it to a public repository.

## Project Structure

```
.
├── manifest.json     # Extension configuration (Manifest V3)
├── content.js        # Scrapes problem title + solution code from GFG pages
├── popup.html         # Extension popup UI
├── popup.js          # Handles form input, GitHub API calls
└── style.css          # Popup styling
```

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Save GitHub credentials locally |
| `activeTab` | Access the current GFG tab to read problem/code |
| `scripting` | Support content script injection |
| `host_permissions` (geeksforgeeks.org, api.github.com) | Read problem pages and push to GitHub |

## Tech Stack

- Vanilla JavaScript (no build step)
- Chrome Extensions Manifest V3
- GitHub REST API (Contents endpoint)

## License

MIT — feel free to fork and adapt.

## Contributing

Issues and pull requests are welcome! If GFG changes its editor markup and the content script stops detecting code, please open an issue with details.
