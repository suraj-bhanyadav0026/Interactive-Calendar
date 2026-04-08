// === FILE: README.md ===
# ╔══════════════════════════════════════════════╗
# ║      INTERACTIVE WALL CALENDAR (REACT)      ║
# ╚══════════════════════════════════════════════╝

A premium, editorial-style wall calendar component built with React and pure CSS.  
It blends tactile design details with advanced interactions like range selection, notes, themes, and motion.

## Live Demo
**Live Demo:** http://localhost:5173/ (dev server)  
**Deploy:** Run `npm run build` then deploy `dist/` to Vercel/Netlify for public link.

## Screenshot
See `/screenshots` folder.

## Features
- 🎨 Editorial wall-calendar aesthetic with hero photography and spiral binding
- 📆 2-click + drag date-range selection with live hover preview
- 📝 Integrated notes panel with localStorage persistence and quick restore
🌗 Light / Dark / Sepia / Cyberpunk themes with smooth transitions
- 🌀 Page-flip month animation + crossfade hero transitions
- 🎉 Holiday dots + tooltip labels (national/festival)
- 📱 Fully responsive layout with mobile accordion notes + swipe navigation
- ♿ Keyboard and screen-reader friendly grid interactions

## Tech Stack
- React
- Pure CSS (custom properties, grid, animations, media queries)
- localStorage
- Zero third-party dependencies beyond React

## Getting Started
```bash
git clone <your-repo-url>
npm install
npm start
```

## Usage Guide
- **Select range:** Click a start day, hover for preview, click end day to confirm.
- **Add note:** Select a range, type in notes area, click `Save Note`.
**Switch themes:** Use top-right color swatches for Light, Dark, Sepia, or Cyberpunk (neon/glassmorphism).
- **Mobile navigation:** Swipe left/right on the calendar card to move months.

GIF suggestions:
- `range-selection.gif`: 2-click + hover preview
- `notes-flow.gif`: save + restore note
- `theme-switch.gif`: instant mood shifts across all themes

## Keyboard Shortcuts
| Key | Action |
|---|---|
| Tab | Focus calendar grid |
| Arrow Keys | Move focused day |
| Enter / Space | Select focused day |
| Escape | Clear selected range |

## Design Decisions
- **2-click primary selection:** More reliable than drag on touch screens, while drag remains available on desktop.
- **Monday-first grid + ISO week numbers:** Aligns with global editorial/calendar standards and professional workflows.
- **CSS-driven motion:** Page flip, ink-drop, and toast animations are native and lightweight.
- **Local-first notes:** Storage persists instantly in-browser with zero backend.
- **Theme tokens via CSS variables:** Makes visual systems scalable and easy to maintain.

## Browser Support
| Browser | Support |
|---|---|
| Chrome (latest) | ✅ |
| Edge (latest) | ✅ |
| Firefox (latest) | ✅ |
| Safari 16+ | ✅ |

## HOW TO RUN
```bash
cd "nteractive Calendar "
npm install
npm start
```

## WHAT MAKES THIS STAND OUT
- Sophisticated physical-calendar visual language with tactile paper and binding details.
- High-polish interactions: live range preview, drag-select, swipe months, and page-flip transitions.
- Strong engineering fundamentals: custom hooks, manual date math, memoized computation, and accessible semantics.
- Product thinking: notes workflow, copy/share utility, week-number toggle, and dynamic range analytics.
- Portfolio-ready craftsmanship: responsive across breakpoints, theme system, and no UI-library shortcuts.
# Interactive-Calendar
