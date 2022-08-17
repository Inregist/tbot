import { Client, FlexMessage } from '@line/bot-sdk';
import { convertTimeframe } from '../../utils/tradingviewUtils';
import MemDBService from '../database';
import { EntrySignalMessage, EntrySignalMessageProp } from './flexMessages';

export default class LineService {
  private client: Client;
  private db: MemDBService;

  constructor(accessToken: string, secret: string, db: MemDBService) {
    this.client = new Client({
      channelAccessToken: accessToken,
      channelSecret: secret,
    });

    this.db = db;
  }

  async sendEntrySignalMessage(userIds: any[], signal: EntrySignalMessageProp) {
    const { symbol, direction, price, target } = signal ?? {};

    const msg: FlexMessage = {
      type: 'flex',
      altText: `${direction.toUpperCase()} ${symbol} at ${price}, sl: ${target}`,
      contents: EntrySignalMessage(signal),
    };

    console.log('userIds:', userIds);
    if (userIds.length > 0) this.client.multicast(userIds, msg);
  }
}
