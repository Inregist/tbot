import { FlexBubble, FlexContainer } from '@line/bot-sdk';

export interface EntrySignalMessageProp {
  symbol: string;
  direction: 'long' | 'short';
  entry_price: number;
  sl_price: number;
}

export const EntrySignalMessage = (
  order: EntrySignalMessageProp
): FlexContainer => {
  const { symbol, direction, entry_price, sl_price } = order ?? {};
  const color = {
    green: '#088249',
    red: '#bd1b06',
  };

  return {
    type: 'bubble',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: `${direction.toUpperCase()} ${symbol}`,
          size: 'lg',
          weight: 'bold',
          color: direction === 'long' ? color.green : color.red,
        },
      ],
      backgroundColor: '#eeeeee',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: `${symbol}`,
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'lg',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'Entry at',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 3,
                },
                {
                  type: 'text',
                  text: `${entry_price}`,
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 3,
                  weight: 'bold',
                },
              ],
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'Stoploss at',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 3,
                },
                {
                  type: 'text',
                  text: `${sl_price}`,
                  wrap: true,
                  color: '#bd1b06',
                  size: 'sm',
                  flex: 3,
                  weight: 'bold',
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'none',
      contents: [
        {
          type: 'button',
          height: 'sm',
          action: {
            type: 'uri',
            label: 'View chart',
            uri: 'https://www.tradingview.com/chart/cEgVJd3k/?symbol=BITSTAMP%3ABTCUSD',
          },
          flex: 1,
          style: 'link',
        },
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          action: {
            type: 'uri',
            label: 'Execute',
            uri: 'https://www.tradingview.com/chart/cEgVJd3k/?symbol=BITSTAMP%3ABTCUSD',
          },
          flex: 1,
        },
      ],
      flex: 0,
    },
  };
};
