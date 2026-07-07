import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middlewares/requestLogger.js';
import { corsOptions } from './config/cors.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

// Import event initializers
import { initCatalogEvents } from './modules/catalog/catalog.events.js';
import { initVoucherEvents } from './modules/voucher/voucher.events.js';
import { initOrderEvents } from './modules/order/order.events.js';

// Initialize events
initCatalogEvents();
initVoucherEvents();
initOrderEvents();

const app = express();

// Middleware Chain
app.use(requestLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Root simple status route
app.get('/status', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Mount routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
