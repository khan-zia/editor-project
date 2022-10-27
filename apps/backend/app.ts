import express from 'express';
import http from 'http';
import cors from 'cors';
import { ServerSocket } from './socket';

import apiRoutes from './routes';

const PORT = 3001;
const app = express();

// Create an HTTP server.
const httpServer = http.createServer(app);

// Initiate websocket on the server.
export const socket = new ServerSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', apiRoutes);

httpServer.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
