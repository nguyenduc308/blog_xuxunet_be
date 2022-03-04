require('dotenv').config({ path: process.cwd() + '/.env' });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { connectDB } = require('./configs/database');
const { errorsHandler } = require('./middlewares/errorsHandler');

async function assertDatabaseConnectionOk() {
  try {
    await connectDB();
  } catch(e) {
    process.exit(1);
  }
}

const port = parseInt(process.env.PORT || '5000', 10);

(async () => {
  const server = express();
  // await assertDatabaseConnectionOk();
  
  server.use(cors({
    "origin": process.env.FE_URL,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }));
  server.use(express.json());
  server.use('/api', require('./routes'));
  server.use(errorsHandler);

  server.listen(port, () => {
    console.table({
      host: `> Ready on http://localhost:${port}`,
      fe: process.env.FE_URL
    });
  });
})();
