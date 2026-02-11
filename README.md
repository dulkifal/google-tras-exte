# Google Translate Customizer 🛠️

A specialized Chrome Extension designed to optimize the Google Translate workflow for professional translators and power users.

## Overview

As a translator transitioning into software development, I built this tool to solve specific friction points in my daily workflow. The standard Google Translate interface, while functional, lacked the specific typographic and UI optimizations needed for high-volume Arabic translation.

This extension treats the translation interface as a workspace, not just a webpage.

## Key Features

### 1. Enhanced Arabic Typography ✍️
- **Font Injection:** Replaces the default font with **Sakkal Majalla**, a standard in professional Arabic typesetting.
- **Readability:** Increases font size and weight for better scanning and reduced eye strain during long sessions.

### 2. Workflow Optimization ⚡
- **Smart Copy Button:** Relocates the copy action to a more ergonomic position, reducing mouse travel time.
- **Distraction-Free Mode:** Hides the Google header and footer elements to maximize screen real estate for the text itself.

### 3. Rich Text Clipboard 📋
- **Preserved Formatting:** Custom copying logic ensures that when text is pasted into Microsoft Word, it retains the correct font (Sakkal Majalla) and direction (RTL), saving hours of re-formatting time.

## Installation from Source

1.  Clone this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right.
4.  Click **Load unpacked**.
5.  Select the directory containing this project.

## Technical Details

-   **Manifest V3**: Built with the latest Chrome Extension standards.
-   **Content Scripts**: Uses vanilla JavaScript for lightweight, fast DOM manipulation.
-   **CSS Injection**: declarative styles for immediate visual updates.

---

*Built by a translator, for translators.*
