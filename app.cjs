#!/env/bin node
const { rateLimit } = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const { Client } = require('raknet-native');

const PORT = process.env.PORT || 8000;
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
});

app.use(limiter);

app.all('/api/ping', (req, res) => {
  try {
    const { hostname, port = 19132 } = req.query;
    const client = new Client(hostname, port);

    client.ping();

    client.once('pong', (evd) => {
      const args = evd.extra.toString().split(';');

      res.json({
        version: args[3] ?? 'unknown',
        bedrockProtocolVersion: args[2] ?? 'unknown',
        online: args[4] ?? 0,
        serverSlots: args[5] ?? 0,
        serverId: args[6] ?? 'unknown',
        serverSoftware: args[7] ?? 'unknown',
        defaultGamemode: args[8] ?? 'unknown',
      });
    });
  } catch {
    res.status(400).json({ error: 'Bad request!' });
  }
});

app.all('/*', (_, res) => {
  res.redirect('https://github.com/ReallyFatYoshi-Random/bedrock-ping');
});

app.listen(PORT, () => console.log('Listening on http://localhost:%s', PORT));

module.exports = app;
