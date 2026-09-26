/* global BigInt */
// Exact rational arithmetic on BigInt numerator/denominator pairs.
// Values are always reduced, with a positive denominator.
// BigInt() calls are used rather than `n` literals / `**`, which Babel can mangle.

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);

const abs = (x) => (x < ZERO ? -x : x);

function gcd(a, b) {
  a = abs(a);
  b = abs(b);
  while (b !== ZERO) [a, b] = [b, a % b];
  return a;
}

function pow(base, exp) {
  let result = ONE;
  for (let i = 0; i < exp; i++) result *= base;
  return result;
}

export function make(n, d = ONE) {
  if (d === ZERO) throw new RangeError('Division by zero');
  if (d < ZERO) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || ONE;
  return { n: n / g, d: d / g };
}

export const add = (a, b) => make(a.n * b.d + b.n * a.d, a.d * b.d);
export const subtract = (a, b) => make(a.n * b.d - b.n * a.d, a.d * b.d);
export const multiply = (a, b) => make(a.n * b.n, a.d * b.d);
export const divide = (a, b) => make(a.n * b.d, a.d * b.n);

// Parses an unsigned numeral such as "3a.46" in the given base.
export function parse(str, base) {
  const parts = str.split('.');
  if (parts.length > 2) throw new SyntaxError(`Invalid number: ${str}`);
  const [int, frac = ''] = parts;
  const b = BigInt(base);
  let n = ZERO;
  for (const ch of int + frac) {
    const digit = parseInt(ch, base);
    if (Number.isNaN(digit)) throw new SyntaxError(`Invalid digit "${ch}" in base ${base}`);
    n = n * b + BigInt(digit);
  }
  return make(n, pow(b, frac.length));
}

// Expands q in the given base. If the fractional digits recur within
// maxDigits, the recurring block is returned in `repeat`; otherwise the
// expansion is rounded to maxDigits and flagged `approx`.
export function toDigits(q, base, maxDigits = 12) {
  const b = BigInt(base);
  const negative = q.n < ZERO;
  const n = abs(q.n);
  const digitString = (digits) => digits.map((x) => x.toString(base)).join('');

  const digits = [];
  const seen = new Map();
  let rem = n % q.d;
  while (rem !== ZERO && !seen.has(rem) && digits.length < maxDigits) {
    seen.set(rem, digits.length);
    rem *= b;
    digits.push(rem / q.d);
    rem %= q.d;
  }

  const int = (n / q.d).toString(base);
  if (rem === ZERO) {
    return { negative, int, frac: digitString(digits), repeat: '', approx: false };
  }
  if (seen.has(rem)) {
    const start = seen.get(rem);
    return {
      negative,
      int,
      frac: digitString(digits.slice(0, start)),
      repeat: digitString(digits.slice(start)),
      approx: false,
    };
  }

  // No recurrence found in range: round half up to maxDigits.
  const scale = pow(b, maxDigits);
  const scaled = (n * scale * TWO + q.d) / (q.d * TWO);
  const frac = (scaled % scale).toString(base).padStart(maxDigits, '0').replace(/0+$/, '');
  return { negative, int: (scaled / scale).toString(base), frac, repeat: '', approx: true };
}

// Plain-text rendering: recurring digits in parentheses, "…" when rounded.
export function format(q, base, maxDigits) {
  const { negative, int, frac, repeat, approx } = toDigits(q, base, maxDigits);
  let str = `${negative ? '-' : ''}${int}`;
  if (frac || repeat) str += `.${frac}${repeat ? `(${repeat})` : ''}`;
  return approx ? `${str}…` : str;
}
