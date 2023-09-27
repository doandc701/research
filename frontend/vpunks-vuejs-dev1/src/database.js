import Dexie from 'dexie'

class MainDB extends Dexie {
  constructor() {
    super('main_db')
    this.version(1).stores({
      wallets: '++id, &address, name'
    })
  }
}

const DB = new MainDB()

export default DB
