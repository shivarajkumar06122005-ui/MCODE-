import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { apiRouter } from './src/server/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// Backend API Routes
app.use('/api', apiRouter);

async function startServer() {
  if (!isProduction) {
    // In dev: mount Vite middleware directly
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        port: Number(PORT),
        host: '0.0.0.0',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production: serve bundled frontend from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[MCODE Server] Listening on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[MCODE Server] Fatal error starting server:', err);
  process.exit(1);
});
