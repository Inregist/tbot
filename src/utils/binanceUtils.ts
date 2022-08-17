import crypto from 'crypto';
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET ?? '';

export const generateSignature = (paramsObject: Record<string, any>) => {
  const queryString = Object.keys(paramsObject)
    .map((key) => {
      return `${encodeURIComponent(key)}=${paramsObject[key]}`;
    })
    .join('&');

  console.log(queryString);

  return crypto
    .createHmac('sha256', BINANCE_API_SECRET)
    .update(queryString)
    .digest('hex');
};

export const queryToString = (
  secret: string,
  query: Record<string, any>,
  withSignature: boolean = false
) => {
  const queryString = Object.keys(query)
    .map((key) => {
      return `${encodeURIComponent(key)}=${query[key]}`;
    })
    .concat(`timestamp=${Date.now()}`)
    .join('&');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(queryString)
    .digest('hex');

  return queryString + (withSignature ? `&signature=${signature}` : '');
};
