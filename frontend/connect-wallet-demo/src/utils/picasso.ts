const MersenneTwister = function (seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }

  /* Period parameters */
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df; /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

  if (seed.constructor == Array) {
    this.init_by_array(seed, seed.length);
  } else {
    this.init_seed(seed);
  }
};

/* initializes mt[N] with a seed */
/* origin name init_genrand */
MersenneTwister.prototype.init_seed = function (s) {
  this.mt[0] = s >>> 0;
  for (this.mti = 1; this.mti < this.N; this.mti++) {
    const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
    this.mt[this.mti] =
      ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
      (s & 0x0000ffff) * 1812433253 +
      this.mti;
    /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
    /* In the previous versions, MSBs of the seed affect   */
    /* only MSBs of the array mt[].                        */
    /* 2002/01/09 modified by Makoto Matsumoto             */
    this.mt[this.mti] >>>= 0;
    /* for >32 bit machines */
  }
};

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
  let i, j, k;
  this.init_seed(19650218);
  i = 1;
  j = 0;
  k = this.N > key_length ? this.N : key_length;
  for (; k; k--) {
    const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
    this.mt[i] =
      (this.mt[i] ^
        (((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
          (s & 0x0000ffff) * 1664525)) +
      init_key[j] +
      j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    j++;
    if (i >= this.N) {
      this.mt[0] = this.mt[this.N - 1];
      i = 1;
    }
    if (j >= key_length) j = 0;
  }
  for (k = this.N - 1; k; k--) {
    const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
    this.mt[i] =
      (this.mt[i] ^
        (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
          (s & 0x0000ffff) * 1566083941)) -
      i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i >= this.N) {
      this.mt[0] = this.mt[this.N - 1];
      i = 1;
    }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};

/* generates a random number on [0,0xffffffff]-interval */
/* origin name genrand_int32 */
MersenneTwister.prototype.random_int = function () {
  let y;
  const mag01 = [0x0, this.MATRIX_A];
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) {
    /* generate N words at one time */
    let kk;

    if (this.mti == this.N + 1)
      /* if init_seed() has not been called, */
      this.init_seed(5489); /* a default initial seed is used */

    for (kk = 0; kk < this.N - this.M; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (; kk < this.N - 1; kk++) {
      y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
      this.mt[kk] =
        this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y =
      (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
    this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= y >>> 11;
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= y >>> 18;

  return y >>> 0;
};

/* generates a random number on [0,0x7fffffff]-interval */
/* origin name genrand_int31 */
MersenneTwister.prototype.random_int31 = function () {
  return this.random_int() >>> 1;
};

/* generates a random number on [0,1]-real-interval */
/* origin name genrand_real1 */
MersenneTwister.prototype.random_incl = function () {
  return this.random_int() * (1.0 / 4294967295.0);
  /* divided by 2^32-1 */
};

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function () {
  return this.random_int() * (1.0 / 4294967296.0);
  /* divided by 2^32 */
};

/* generates a random number on (0,1)-real-interval */
/* origin name genrand_real3 */
MersenneTwister.prototype.random_excl = function () {
  return (this.random_int() + 0.5) * (1.0 / 4294967296.0);
  /* divided by 2^32 */
};

/* generates a random number on [0,1) with 53-bit resolution*/
/* origin name genrand_res53 */
MersenneTwister.prototype.random_long = function () {
  const a = this.random_int() >>> 5,
    b = this.random_int() >>> 6;
  return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
};

// see https://github.com/danfinlay/jazzicon
// const MersenneTwister = require('mersenne-twister');
const defaultColors = [
  "rgb(244, 67, 54)",
  "rgb(233, 30, 99)",
  "rgb(156, 39, 176)",
  "rgb(103, 58, 183)",
  "rgb(63, 81, 181)",
  "rgb(33, 150, 243)",
  "rgb(3, 169, 244)",
  "rgb(0, 188, 212)",
  "rgb(0, 150, 136)",
  "rgb(76, 175, 80)",
  "rgb(139, 195, 74)",
  "rgb(205, 220, 57)",
  "rgb(255, 193, 7)",
  "rgb(255, 152, 0)",
  "rgb(255, 87, 34)"
];

const hash = function (str: string) {
  if (str.length === 0) {
    return 0;
  }
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = h * 31 + str.charCodeAt(i);
    h = h % 2 ** 32;
  }
  return h;
};

export function picasso(content: string, colors?: string[]) {
  colors = colors || defaultColors;
  const seed = hash(content);
  const rand = new MersenneTwister(seed);

  colors = colors.slice();

  const genColor = () => {
    const idx = Math.floor(colors!.length * rand.random());
    return colors!.splice(idx, 1)[0];
  };

  const bgStr = `<rect fill="${genColor()}" width="100" height="100"/>`;
  const style = `<style>.picasso circle{mix-blend-mode:soft-light;}</style>`;
  let shapesStr = "";
  const layers = 3;
  const rs = [35, 40, 45, 50, 55, 60];
  const cxs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const cys = [30, 40, 50, 60, 70];

  for (let i = 0; i < layers; i++) {
    const r = rs.splice(Math.floor(rs.length * rand.random()), 1)[0];
    const cx = cxs.splice(Math.floor(cxs.length * rand.random()), 1)[0];
    const cy = cys.splice(Math.floor(cys.length * rand.random()), 1)[0];
    const fill = genColor();

    shapesStr += `<circle r="${r}" cx="${cx}" cy="${cy}" fill="${fill}"/>`;
  }
  return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="picasso" width="100" height="100" viewBox="0 0 100 100">${style}${bgStr}${shapesStr}</svg>`;
}

export default picasso;
