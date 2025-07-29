# Memory Matching Card Game

A responsive web-based memory matching game built with React for the frontend and Express for the backend.

## Features
- Grid of cards with emoji images
- Animated card flips with match logic
- Attempt counter and matched pairs tracking
- Timer with best time record (stored per difficulty)
- Difficulty selector (easy, medium, hard)
- Responsive design for desktop and mobile
- Sound effects on flip and match
- Timer with best time record
- Responsive design for desktop and mobile
- Restart button to reset the game

## Running the Game
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open your browser at [http://localhost:3000](http://localhost:3000) to play.

Sound effects and best times are stored in your browser. To clear scores, use your browser's storage settings.
Optional enhancements such as sound effects can be added by extending the `public/index.jsx` file.