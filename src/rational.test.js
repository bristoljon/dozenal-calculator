/* global BigInt */
import { add, subtract, multiply, divide, parse, format } from './rational';

const doz = (str) => parse(str, 12);
const dec = (str) => parse(str, 10);

describe('parse', () => {
  test('reads dozenal fractions exactly', () => {
    expect(doz('0.1')).toEqual({ n: BigInt(1), d: BigInt(12) });
    // 3a46₁₂ = 6678, over 12² = 144, reduced.
    expect(doz('3a.46')).toEqual({ n: BigInt(371), d: BigInt(8) });
  });

  test('accepts partial input while typing', () => {
    expect(format(doz('5.'), 12)).toBe('5');
    expect(format(doz('.6'), 12)).toBe('0.6');
    expect(format(doz(''), 12)).toBe('0');
  });

  test('rejects digits outside the base', () => {
    expect(() => parse('1a', 10)).toThrow(SyntaxError);
    expect(() => parse('1.2.3', 12)).toThrow(SyntaxError);
  });
});

describe('arithmetic is exact in dozenal', () => {
  test.each([
    [divide, '1', '3', '0.4'],
    [multiply, '0.4', '3', '1'],
    [multiply, '0.1', '10', '1'],
    [add, '0.1', '0.2', '0.3'],
    [subtract, '1', '0.b', '0.1'],
    [divide, '1', '5', '0.(2497)'],
    [divide, '1', '7', '0.(186a35)'],
    [divide, '1', '2', '0.6'],
    [subtract, '1', '3', '-2'],
    [subtract, '0.4', '1', '-0.8'],
  ])('%p(%s, %s) = %s', (op, a, b, expected) => {
    expect(format(op(doz(a), doz(b)), 12)).toBe(expected);
  });

  test('(1 / 3) * 3 round-trips', () => {
    expect(format(multiply(divide(doz('1'), doz('3')), doz('3')), 12)).toBe('1');
  });

  test('division by zero throws', () => {
    expect(() => divide(doz('1'), doz('0'))).toThrow(RangeError);
  });
});

describe('format', () => {
  test('converts between bases without loss', () => {
    expect(format(doz('0.1'), 10)).toBe('0.08(3)');
    expect(format(dec('0.1'), 12)).toBe('0.1(2497)');
    expect(format(doz('3a.46'), 10)).toBe('46.375');
    expect(format(doz('0.1'), 12)).toBe('0.1');
  });

  test('rounds long recurrences and marks them approximate', () => {
    // 1/17 in decimal recurs every 16 digits.
    expect(format(divide(dec('1'), dec('17')), 10)).toBe('0.058823529412…');
  });
});
