import express from 'express';
const bodyParser = require('body-parser');
const line = require('@line/bot-sdk');
const { OrderMessage } = require('./flexMessage');

const app = express();

const DB = require('./memdb-json');

const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post('/tv', async (req, res) => {
  const time = new Date();
  console.log(time);
  console.log(req.body);
  console.log('\n');

  // call binance api
  // binance.openOrder()

  // send line notification
  const { symbol, direction, entry_price, sl_price, tp_price } = req.body ?? {};
  const msg = {
    type: 'flex',
    altText: `${direction.toUpperCase()} ${symbol} at ${entry_price}, sl: ${sl_price}, tp: ${tp_price}`,
    contents: OrderMessage(req.body),
  };

  try {
    // client.broadcast(msg)
  } catch (e: any) {
    console.log(e.message);
  }

  res.status(200).send('OK');
});

// app.get('/calculate-pos-size')

app.listen(3000, () => {
  console.log('app is running');
});
