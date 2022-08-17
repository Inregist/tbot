import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import LineService from './services/line';
import MemDBService from './services/database';
import dotenv from 'dotenv';
import BinanceService from './services/binance';
import { convertTimeframe } from './utils/tradingviewUtils';

dotenv.config();
const app = express();

const db = new MemDBService();
const line = new LineService(
  process.env.LINE_CHANNEL_ACCESS_TOKEN ?? '',
  process.env.LINE_CHANNEL_SECRET ?? '',
  db
);
const binance = new BinanceService();

app.use(helmet());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post('/tv', async (req: Request, res: Response) => {
  const time = new Date();
  console.log(time);
  console.log(req.body);

  try {
    // fetch users
    const { symbol, timeframe, direction, price, target } = req.body;
    const tf = convertTimeframe(timeframe);
    const userSymbols = db.userSymbol.select({
      where: { symbolId: `${symbol}-${tf}` },
    });

    const ids = userSymbols.filter((us) => us.autoTrade).map((us) => us.lineId);
    const users = db.user.select().filter((u) => ids.includes(u.lineId));
    console.log('userSymbols', userSymbols);
    console.log('users', users);

    // call binance api
    const orders = await Promise.all(
      users.map((u) =>
        binance.CreateOrder({
          apiKey: u.apiToken,
          apiSecret: u.apiSecret,
          symbol,
          side: direction === 'long' ? 'BUY' : 'SELL',
          price,
          stopLoss: target,
        })
      )
    );
    console.log(orders);

    // send line notification
    line.sendEntrySignalMessage(
      userSymbols.map((us) => us.lineId),
      req.body
    );
  } catch (e: any) {
    console.error(e.message);
  }

  res.status(200).send('OK');
});

app.post('/line-hook', async (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send('OK');
});

// app.get('/calculate-pos-size')

app.listen(3000, () => {
  console.log('app is running');
});
