import MemDB from './memdb';

export default class MemDBService {
  constructor() {}

  user = new MemDB('./db/user.json');
  symbol = new MemDB('./db/symbol.json');
  userSymbol = new MemDB('./db/user-symbol.json');
  order = new MemDB('./db/order.json');
  signalLog = new MemDB('./db/signal-log.json');
}
