const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

export default class MemDB {
  private db: any[] = [];

  constructor(path: string) {
    if (!path.endsWith('.json')) throw new Error('Need .json file as path');
    if (path === undefined) this.db = [];
    else {
      try {
        this.db = JSON.parse(fs.readFileSync(path).toString());
      } catch (x) {
        this.save(path);
      }
    }
  }

  #isJSONObject(obj: any) {
    return obj !== undefined && obj !== null && obj.constructor == Object;
  }

  insert(obj: any) {
    if (!this.#isJSONObject(obj)) throw new Error('Not an object');
    obj.memDBID = uuidv4();
    this.db.push(obj);
    return obj.memDBID;
  }

  select(obj: any) {
    if (obj === undefined) return this.db;
    else {
      if (Object.keys(obj).indexOf('where') === -1 || !this.#isJSONObject(obj))
        throw new Error('Query error');
      /*return this.db.filter((x) => {
                return x[Object.keys(obj.where)[0]] === obj.where[Object.keys(obj.where)[0]];
            });*/
      return this.#inSelect(obj.where);
    }
  }

  #inSelect(obj: any) {
    let a = this.db.filter((x) => {
      return x[Object.keys(obj)[0]] === obj[Object.keys(obj)[0]];
    });
    for (let i = 1; i < Object.keys(obj).length; i++) {
      a = a.filter((x) => {
        return x[Object.keys(obj)[i]] === obj[Object.keys(obj)[i]];
      });
    }
    return a;
  }

  update(obj: any) {
    if (
      Object.keys(obj).indexOf('where') === -1 ||
      Object.keys(obj).indexOf('set') === -1 ||
      !this.#isJSONObject(obj)
    )
      throw new Error('Query error');
    /*let a = this.db.filter((x) => {
            return x[Object.keys(obj.where)[0]] === obj.where[Object.keys(obj.where)[0]];
        });*/
    let a = this.#inSelect(obj.where);
    const set = obj.set;
    a.forEach((_a) => {
      Object.keys(set).forEach((_set) => {
        _a[_set] = set[_set];
      });
    });
    return a;
  }

  delete(obj: any) {
    if (Object.keys(obj).indexOf('where') === -1 || !this.#isJSONObject(obj))
      throw new Error('Query error');
    this.db = this.db.filter((x) => {
      //console.info(obj.where[Object.keys(obj.where)[0]]);
      return (
        x[Object.keys(obj.where)[0]] !== obj.where[Object.keys(obj.where)[0]]
      );
    });
    //return this.db;
  }

  truncate() {
    this.db = [];
  }

  save(path: string) {
    if (path === null || path === undefined) throw new Error('Path is missing');
    try {
      const a = fs.createWriteStream(path);
      a.write(JSON.stringify(this.db, null, 2));
      a.end();
    } catch (x) {
      throw x;
    }
  }
}