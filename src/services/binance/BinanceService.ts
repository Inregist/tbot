import axios from 'axios';
import { queryToString } from '../../utils/binanceUtils';
export interface Key {
  key: string;
  secret: string;
}

export interface CreateOrder {
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  stopLoss: number;
  apiKey: string;
  apiSecret: string;
}

const url = 'https://testnet.binancefuture.com';
export default class BinanceService {
  async GetUserBalance(apiKey: Key) {
    const query = queryToString(apiKey.secret, {}, true);
    console.log(`${url}/fapi/v2/balance?${query}`);
    try {
      const res = await axios.get(`${url}/fapi/v2/balance?${query}`, {
        headers: {
          'X-MBX-APIKEY': apiKey.key,
        },
      });
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async CreateOrder(order: CreateOrder) {
    const { symbol, side, price, stopLoss, apiKey, apiSecret } = order;
    const headers = {
      'X-MBX-APIKEY': apiKey,
    };
    // fetch balance
    const balance = (
      await axios.get(
        `${url}/fapi/v2/balance?${queryToString(apiSecret, {}, true)}`,
        { headers }
      )
    ).data;
    console.log(balance);
    // cal pos size
    const quantity = 0.01;

    // create order
    const orderParams = {
      symbol,
      side,
      type: 'LIMIT',
      timeInForce: 'GTC',
      quantity,
      price,
    };
    const orderResult = (
      await axios.post(
        `${url}/fapi/v1/order?${queryToString(apiSecret, orderParams, true)}`,
        null,
        { headers }
      )
    ).data;
    console.log(orderResult);

    return orderResult;
  }

  // async CreateOrder(order: any) {
  //   const query = queryToString(apiKey.secret, order, true);
  //   console.log(`${url}?${query}`);
  //   // axios.post(`${url}?${query}`);
  // }

  // async CloseOrder(order: any) {
  //   const query = queryToString(order, true);
  //   console.log(`${url}?${query}`);
  //   // axios.post(`${url}?${query}`);
  // }
}
