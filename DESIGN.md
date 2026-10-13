# PulseFit design notes

Use these when you explain the project. Each choice has a reason.

## Concept
A small-group strength studio for people put off by loud gyms. The
promise is "train hard, keep it quiet": capped classes, no mirrors. Copy,
colors and layout all follow from that.

## Color (muted stone and sage)
| Token | Why |
|---|---|
| `--bg` warm stone | Dark neon is the gym cliche; a warm light ground reads calm. |
| `--sage` / `--sage-deep` | One green for all emphasis, so there is a single focal color. |
| `--clay` | Used only for small notes (per-class price), so it stays rare. |
| `--ink-soft` | Secondary text, about 5:1 contrast on the background. |

Intensity (Gentle, Steady, Hard) uses three tints of sage, darker for
harder. It is also written as text on every card, so color is never the
only signal.

## Typography
Serif display (Georgia) for headings and prices, system sans for body.
Serif headings feel editorial and calm. No web font means no extra request.

## Layout: why Grid here, why Flexbox there
- **Nav, hero facts, legend, card internals: Flexbox.** One-dimensional rows
  or columns that only need spacing and alignment.
- **Schedule: Grid with subgrid.** A timetable is 2D. Each day borrows the
  parent's rows so slots line up across days even when text wraps.
- **Trainers: Flexbox with `flex: 1 1 220px` and wrap.** The list length
  changes and cards should fill their row. No breakpoint needed.
- **Pricing: Grid, `repeat(3, 1fr)`.** Tiers must be equal and aligned to be
  comparable. The featured tier is marked by border and badge, not size.

## Responsive
- 900px: schedule goes 6 to 3 columns, pricing and footer go to 1 column.
- 640px: schedule is 1 column, nav stacks, hero text shrinks.
- Cards and text use `1fr` and `max-width`, not fixed widths, so there is
  no horizontal scroll.

## Content decisions
- "Steady" at $72 ($9 a class) is the anchor plan; the copy says why.
- Class cap of 12 appears in the hero because it is the main selling point.
