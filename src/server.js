import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(pino());

app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  res.status(200).json({
    message: `Retrieved note with ID: ${req.params.noteId}`,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.get('/test-error', (req, res, next) => {
  next(new Error('Simulated server error'));
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
