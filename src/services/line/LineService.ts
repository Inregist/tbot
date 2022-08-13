import { Client, FlexMessage } from '@line/bot-sdk';
import { EntrySignalMessage, EntrySignalMessageProp } from './flexMessages';

export default class LineService {
  private client: Client;

  constructor(accessToken: string, secret: string) {
    this.client = new Client({
      channelAccessToken: accessToken,
      channelSecret: secret,
    });
  }

  async sendEntrySignalMessage(signal: EntrySignalMessageProp) {
    const { symbol, direction, entry_price, sl_price } = signal ?? {};
    const msg: FlexMessage = {
      type: 'flex',
      altText: `${direction.toUpperCase()} ${symbol} at ${entry_price}, sl: ${sl_price}`,
      contents: EntrySignalMessage(signal),
    };

    this.client.broadcast(msg);
  }
}
