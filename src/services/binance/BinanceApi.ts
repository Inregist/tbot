import axios, { AxiosResponse } from 'axios';
import { queryToString } from '../../utils/binanceUtils';

const url = 'https://testnet.binancefuture.com';

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
  BOTH = 'BOTH',
}

export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  TAKE_PROFIT = 'TAKE_PROFIT',
  STOP_MARKET = 'STOP_MARKET',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
  TRAILING_STOP_MARKET = 'TAKE_PROFIT_MARKET',
}

export interface Key {
  apiKey: string;
  apiSecret: string;
}

export interface ApiCreateOrder extends Key {
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  stopLoss: number;
  type?: OrderType;
}

export interface ApiGetPositions extends Key {
  symbol?: string;
}

export interface ApiCloseOrder extends Key {
  symbol: string;
  ids?: string[];
}

export interface ApiClosePosition extends Key {
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
}

export const GetBalance = async (key: Key) => {
  const { apiKey, apiSecret } = key;
  const headers = {
    'X-MBX-APIKEY': apiKey,
  };
  const { data } = await axios.get(
    `${url}/fapi/v2/balance?${queryToString(apiSecret, {}, true)}`,
    { headers }
  );

  console.log('balance:', data);
  return data;
};

export const GetPositions = async (position: ApiGetPositions) => {
  const { symbol, apiKey, apiSecret } = position;
  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  const payload = {};
  if (symbol) Object.assign(payload, { symbol });

  const { data } = await axios.get(
    `${url}/fapi/v2/positionRisk?${queryToString(apiSecret, payload, true)}`,
    { headers }
  );
  return data;
};

export const CreateOrder = async (signal: ApiCreateOrder) => {
  const {
    symbol,
    side,
    price,
    type = OrderType.LIMIT,
    quantity,
    // stopLoss,
    apiKey,
    apiSecret,
  } = signal;
  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  const payload = {
    symbol,
    side,
    quantity,
    price,
    type,
    timeInForce: 'GTC',
  };

  const { data: orderResult } = await axios.post(
    `${url}/fapi/v1/order?${queryToString(apiSecret, payload, true)}`,
    null,
    { headers }
  );
  console.log('createOrderResult:', orderResult);

  return orderResult;
};

export const CancelOrders = async (order: ApiCloseOrder) => {
  const { apiKey, apiSecret, symbol, ids = [] } = order;
  if (ids.length === 0) return [];

  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  let response: AxiosResponse;
  if (ids.length > 1) {
    const payload = {
      symbol,
      orderIdList: `[${ids.join(',')}]`,
    };

    response = await axios.delete(
      `${url}/fapi/v1/batchOrders?${queryToString(apiSecret, payload, true)}`,
      { headers }
    );

    return response.data;
  } else {
    const payload = {
      symbol,
      orderId: ids[0],
    };

    response = await axios.delete(
      `${url}/fapi/v1/order?${queryToString(apiSecret, payload, true)}`,
      { headers }
    );

    return [response.data];
  }
};

export const ClosePosition = async (position: ApiClosePosition) => {
  const { symbol, side, apiKey, apiSecret, quantity } = position;
  if (quantity === 0) return;

  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  const payload = {
    symbol,
    side,
    type: OrderType.MARKET,
    quantity: side === OrderSide.BUY ? -quantity : quantity,
    reduceOnly: true,
  };

  const { data: orderResult } = await axios.post(
    `${url}/fapi/v1/order?${queryToString(apiSecret, payload, true)}`,
    null,
    { headers }
  );
  console.log('closedPositionResult:', orderResult);

  return orderResult;
};
