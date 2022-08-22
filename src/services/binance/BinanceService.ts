import axios from 'axios';
import { queryToString } from '../../utils/binanceUtils';
import {
  CancelOrders,
  ClosePosition,
  CreateOrder,
  GetBalance,
  GetPositions,
  Key,
  OrderSide,
} from './BinanceApi';

export interface CreateOrder extends Key {
  symbol: string;
  side: OrderSide;
  price: number;
  stopLoss: number;
}

export interface CloseOrder extends Key {
  symbol: string;
  price: number;
  side: OrderSide;
}

const url = 'https://testnet.binancefuture.com';
export default class BinanceService {
  async GetUserBalance(key: Key) {
    try {
      const [balanceList, positionList] = await Promise.all([
        GetBalance(key),
        GetPositions(key),
      ]);

      const balance = balanceList.reduce(
        (sum: number, b: any) =>
          sum +
          (['USDT', 'BUSD'].includes(b.asset) ? parseFloat(b.balance) : 0),
        0
      );

      const positionSize = Math.abs(
        positionList.reduce(
          (sum: number, p: any) =>
            sum +
            (p.symbol.match(/USDT|BUSD/) ? parseFloat(p.notional ?? 0) : 0),
          0
        )
      );

      console.log({ balance, positionSize });
      const risk = (positionSize / (balance + positionSize)) * 100;

      return { balance, risk };
    } catch (e) {
      console.log(e);
    }

    return { balance: 0, risk: 0 };
  }

  async CreateOrder(order: CreateOrder) {
    const { apiKey, apiSecret } = order;

    // fetch balance
    const { balance, risk } = await this.GetUserBalance({ apiKey, apiSecret });
    console.log('balance:', balance);
    console.log('risk:', risk);

    // cal pos size
    if (risk > 5) return;
    const quantity = 0.01;

    // create order
    return CreateOrder({ ...order, quantity });
  }

  async CloseOrder(signal: CloseOrder) {
    const { symbol, price, side, apiKey, apiSecret } = signal;
    const headers = {
      'X-MBX-APIKEY': apiKey,
    };
    try {
      const [{ data: orders }, { data: positions }] = await Promise.all([
        // Get Orders
        axios.get(
          `${url}/fapi/v1/openOrders?${queryToString(
            apiSecret,
            { symbol },
            true
          )}`,
          { headers }
        ),
        // Get Positions
        axios.get(
          `${url}/fapi/v2/positionRisk?${queryToString(
            apiSecret,
            { symbol },
            true
          )}`,
          { headers }
        ),
      ]);

      console.log('orders:', orders);
      console.log('positions:', positions);

      const [closedOrders, closedPositions] = await Promise.all([
        CancelOrders({
          apiKey,
          apiSecret,
          symbol,
          ids: orders.map((o: any) => o.orderId),
        }),
        ClosePosition({
          apiKey,
          apiSecret,
          symbol,
          price,
          side: positions[0].positionAmt > 0 ? OrderSide.SELL : OrderSide.BUY,
          quantity: parseFloat(positions[0]?.positionAmt ?? '0'),
        }),
      ]);

      console.log('closedOrders:', closedOrders);
      console.log('closedPositions:', closedPositions);

      return { closedOrders, closedPositions };
    } catch (e) {
      console.log(e);
    }
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
