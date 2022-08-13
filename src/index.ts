import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import LineService from './services/line';
import MemDBService from './services/database';

const app = express();

// const db = new MemDBService();

// const line = new LineService(
//   process.env.LINE_CHANNEL_ACCESS_TOKEN ?? '',
//   process.env.LINE_CHANNEL_SECRET ?? ''
// );

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
  console.log('\n');

  try {
    // call binance api
    // binance.openOrder()
    // send line notification
    // line.sendEntrySignalMessage(req.body);
  } catch (e: any) {
    console.error(e.message);
  }

  res.status(200).send('OK');
});

// app.get('/calculate-pos-size')

app.listen(3000, () => {
  console.log('app is running');
});
