const dns = require('node:dns/promises');

const { rateLimit } = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const { Client } = require('jsp-raknet');

const app = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
});

app.use(limiter);

app.all('/api/ping', async (req, res) => {
  try {
    const { hostname, port = 19132 } = req.query;

    // Validates hostname
    await dns.lookup(hostname, 4);

    const client = new Client(hostname, port);

    client.ping((evd) => {
      const args = evd.split(';');

      res.json({
        version: args[3] ?? 'unknown',
        bedrockProtocolVersion: args[2] ?? 'unknown',
        online: args[4] ?? 0,
        serverSlots: args[5] ?? 0,
        serverId: args[6] ?? 'unknown',
        serverSoftware: args[7] ?? 'unknown',
        defaultGamemode: args[8] ?? 'unknown',
      });

      client.close();
    });
  } catch {
    res.status(400).json({ error: 'Bad request!' });
  }
});

app.all('/*', (_, res) => {
  res.redirect('https://github.com/ReallyFatYoshi-Random/bedrock-ping');
});

module.exports = app;