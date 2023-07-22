import Connex from "@vechain/connex";

export class Ticker {
  ticker: Connex.Thor.Ticker;
  flag = false;
  constructor(connex: Connex) {
    this.ticker = connex.thor.ticker();
  }

  async tick(cb: () => Promise<void>): Promise<void> {
    for (;;) {
      await cb();
      await this.ticker.next();
      if (this.flag) {
        return;
      }
    }
  }

  stop(): void {
    this.flag = true;
  }
} // end: Ticker
