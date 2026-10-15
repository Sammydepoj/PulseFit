# PulseFit

A small-group strength studio site, rebuilt with Vite, React and Tailwind CSS.

## Run it
```
npm install
npm run dev
```

## Structure
- `src/data/studio.js`: all content (classes, trainers, plans, nav) as arrays.
- `src/components/`: Header, Hero, Schedule, Trainers, Membership, Footer,
  plus small pieces (ClassSlot, TrainerCard, PriceCard, SaveToggle).
- `src/index.css`: Tailwind import and the design tokens in `@theme`.

## State
- `Schedule` uses `useState` for the intensity filter and for saved classes.
- `SaveToggle` is a controlled component: the parent passes `saved` and
  `onToggle`, and the button keeps no state of its own.
