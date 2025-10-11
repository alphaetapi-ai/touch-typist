import express, { Request, Response } from 'express';
import path from 'path';
import { wordLists } from './data/wordLists';

const app = express();
const PORT: number = parseInt(process.env.PORT || '8080', 10);

app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get words for a specific level
app.get('/api/words', (req: Request, res: Response) => {
  const { layout, shift, level } = req.query;

  // Validate layout parameter
  if (layout !== 'qwerty' && layout !== 'dvorak') {
    return res.status(400).json({
      error: 'Invalid layout. Must be "qwerty" or "dvorak"'
    });
  }

  // Validate shift parameter
  if (shift !== 'shift' && shift !== 'no-shift') {
    return res.status(400).json({
      error: 'Invalid shift parameter. Must be "shift" or "no-shift"'
    });
  }

  // Validate and parse level parameter
  const levelNum = parseInt(level as string, 10);
  if (isNaN(levelNum) || levelNum < 1 || levelNum > 24) {
    return res.status(400).json({
      error: 'Invalid level. Must be a number between 1 and 24'
    });
  }

  // Determine which word list to use
  const listKey = `${layout}${shift === 'shift' ? 'Shift' : 'NoShift'}` as keyof typeof wordLists;
  const words = wordLists[listKey][levelNum - 1]; // levelNum is 1-indexed, array is 0-indexed

  res.json({
    layout,
    shift,
    level: levelNum,
    words
  });
});

// Serve the React app HTML for all routes (client-side routing support)
const serveReactApp = (req: Request, res: Response) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Touch Typist</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
</body>
</html>
  `);
};

// Serve React app for all routes (this enables client-side routing)
app.get('*', serveReactApp);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});